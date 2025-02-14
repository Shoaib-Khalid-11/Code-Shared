import axios, {type AxiosRequestConfig, type AxiosResponse} from 'axios';
import {apiRoutes} from 'configs/api_routs.config/apiRoutes';
import appConfig from 'configs/app.config';
import {REQUEST_HEADER_AUTH_KEY, TOKEN_TYPE} from 'constants/api.constant';
import {type ApiBaseResponse, type ApiResponse} from 'global/types/Api.types';
import {t} from 'i18next';
import {merge} from 'lodash';
import {type RefreshTokenResponse} from 'models/auth/refresh_token.response';
import {err, ok} from 'rusty-result-ts';
import {onSignOutSuccess, setToken} from 'store/slices/auth/sessionSlice';
import {sendAlert} from 'store/slices/errors';
import store from 'store/stores/appStore';
import {ApiError, type AxiosErrorType} from './api_error.response';

const unauthorizedCode = [401];
const forbiddenCode = [403];
export class ApiBaseService {
    protected urlBase = '';

    /**
     * Creates a new service instance.
     * @param path A base path for all requests this service will make. Defaults to `/api`.
     */
    public constructor(path?: string) {
        this.urlBase = path ?? appConfig.apiPrefix;
    }

    /**
     * Returns a new instance of the base config for all requests this service makes.
     * @protected
     */
    protected getConfig(): AxiosRequestConfig {
        const accessToken = store.getState().auth.session.JwtToken;

        const headers: any = {};
        if (accessToken) {
            headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${accessToken}`;
        }

        return {
            headers: {...headers},
        };
    }

    /**
     * Make a GET request.
     * @param path A path to append to the base url.
     * @param configOverrides A config object to merge onto the base config.
     * @protected
     */
    protected async get<T>(
        path = '',
        configOverrides: AxiosRequestConfig | undefined = undefined,
    ): Promise<ApiResponse<T>> {
        return await this.requestResultWrapper<T>(path, {method: 'GET', ...configOverrides}, (fullPath, config) => {
            return axios.get(fullPath, config);
        });
    }

    /**
     * Make a POST request.
     * @param path A path to append to the base url.
     * @param data Optional data to send with the request.
     * @param configOverrides A config object to merge onto the base config.
     * @protected
     */
    protected async post<T>(
        path = '',
        data: unknown = undefined,
        configOverrides: AxiosRequestConfig | undefined = undefined,
    ): Promise<ApiResponse<T>> {
        return await this.requestResultWrapper<T>(path, {method: 'POST', ...configOverrides}, (fullPath, config) => {
            return axios.post(fullPath, data, config);
        });
    }

    /**
     * Make a PUT request.
     * @param path A path to append to the base url.
     * @param data Optional data to send with the request.
     * @param configOverrides A config object to merge onto the base config.
     * @protected
     */
    protected async put<T>(
        path = '',
        data: unknown = undefined,
        configOverrides: AxiosRequestConfig | undefined = undefined,
    ): Promise<ApiResponse<T>> {
        return await this.requestResultWrapper<T>(path, {method: 'PUT', ...configOverrides}, (fullPath, config) => {
            return axios.put(fullPath, data, config);
        });
    }

    /**
     * Make a PATCH request.
     * @param path A path to append to the base url.
     * @param data Optional data to send with the request.
     * @param configOverrides A config object to merge onto the base config.
     * @protected
     */
    protected async patch<T>(
        path = '',
        data: unknown = undefined,
        configOverrides: AxiosRequestConfig | undefined = undefined,
    ): Promise<ApiResponse<T>> {
        return await this.requestResultWrapper<T>(path, {method: 'PATCH', ...configOverrides}, (fullPath, config) => {
            return axios.patch(fullPath, data, config);
        });
    }

    /**
     * Make a DELETE request.
     * @param path A path to append to the base url.
     * @param configOverrides A config object to merge onto the base config.
     * @protected
     */
    protected async delete<T>(
        path = '',
        configOverrides: AxiosRequestConfig | undefined = undefined,
    ): Promise<ApiResponse<T>> {
        return await this.requestResultWrapper<T>(path, {method: 'DELETE', ...configOverrides}, (fullPath, config) => {
            return axios.delete(fullPath, config);
        });
    }

    private async requestResultWrapper<T>(
        subPath: string,
        configOverrides: AxiosRequestConfig | undefined,
        request: (
            fullPath: string,
            config: AxiosRequestConfig | undefined,
        ) => Promise<AxiosResponse<ApiBaseResponse<T>> | null>,
    ): Promise<ApiResponse<T>> {
        if (subPath.length > 0 && !subPath.startsWith('/')) subPath = `/${subPath}`;
        const config = merge(this.getConfig() || {}, configOverrides ?? {});

        try {
            const responseData: ApiBaseResponse<T> | null =
                (await request(`${this.urlBase}${subPath}`, config))?.data ?? null;
            return ok(responseData);
        } catch (c) {
            if (!axios.isAxiosError(c)) {
                console.log('error', c);
                return err({errorMessage: 'Unknown error occurred', responseStatus: 0});
            }

            const e = c as unknown as AxiosErrorType;

            if (!e.response) {
                console.log('error', e);
                return err(ApiError(e));
            }

            if (unauthorizedCode.includes(e.response.status)) {
                //fetching refresh token
                try {
                    const response = await axios.post(`${this.urlBase}${apiRoutes.auth.refreshToken()}`, {
                        RefreshToken: store.getState().auth.session.RefreshToken,
                    });
                    if (response.status === 200) {
                        const data: RefreshTokenResponse = response.data.Data as RefreshTokenResponse;
                        store.dispatch(setToken({JwtToken: data.JwtToken, JwtTokenExpiry: data.Expiry}));
                        const responseData: ApiBaseResponse<T> | null =
                            (
                                await request(
                                    `${this.urlBase}${subPath}`,
                                    merge(this.getConfig() || {}, configOverrides ?? {}),
                                )
                            )?.data ?? null;
                        return ok(responseData);
                    }
                    //   const refreshTokenResponse = await request(
                    //     `${this.urlBase}${apiRoutes.auth.refreshToken}`,
                    //     config
                    //   );
                    //   if (refreshTokenResponse && refreshTokenResponse.data) {
                } catch (error) {
                    store.dispatch(
                        sendAlert({
                            title: 'Error',
                            content: t('error.auth.sessionExpired'),
                        }),
                    );
                    store.dispatch(onSignOutSuccess());
                }
            } else if (forbiddenCode.includes(e.response.status)) {
                store.dispatch(sendAlert({title: 'Error', content: t('error.auth.notAuth')}));
            }
            console.log('error', e);
            return err(ApiError(e));
        }
    }
}
