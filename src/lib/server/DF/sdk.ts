import { error } from '@sveltejs/kit';
import { DiligenceFabricClient } from '@ubti/diligence-fabric-sdk';
import { env } from '$env/dynamic/private';

export const client = new DiligenceFabricClient();

export const logger = client.getDFLoggerService()

export const renderLayout = async (locals: any, url: any) => {
	client.setAuthUser(locals.user);

	let authzResponse = await client.getApplicationRoleService().isMenuAuthorized(url.pathname);
	if (!authzResponse.isAuthorized && !authzResponse.empty) {
		throw error(authzResponse.status, 'You are not allowed to access this page!!');
	}

	let logoBase64: string | null = null;

	try {
        const payloadForLogo = {
            TenantID: Number(env.DF_TENANT_ID),
            AppID: Number(env.DF_APP_ID)
        };
		
        const logoResponse: any = await client.getApplicationService().getLogo(payloadForLogo);
        logoBase64 = logoResponse.Result?.LogoBase64 ?? null;
    } catch (logoError) {
        console.log('Logo fetch failed:', logoError);
        logger.log('Warning', 'Layout', 'Logo fetch failed: ' + JSON.stringify(logoError));
    }

	try {
		const response = await client.getApplicationRoleService().getAllAccessibleMenus();
		let dataReturn = { appMenus: response, user: locals.user , logo : logoBase64 };
		if (authzResponse.empty) {
			dataReturn.error = authzResponse.message;
		}
		
		return dataReturn;

	} catch (error) {
		console.log(error);
		logger.log('Error','Layout','Layout Response Error : '+JSON.stringify(error))
		return { appMenus: [], user: locals.user, logo: null , error: error };
	}
};
