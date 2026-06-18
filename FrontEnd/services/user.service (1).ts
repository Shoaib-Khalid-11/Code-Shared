import {apiRoutes} from 'configs/api_routs.config/apiRoutes';
import {type ApiResponse} from 'global/types/Api.types';
import {type PaginationResponseModel} from 'models';
import {type StatusUpdateRequest, type StatusUpdateResponse} from 'models/common';
import {type DivisionResponse} from 'models/division';
import {
    type UserCreateEditRequestMapping,
    type UserDivisionListingRequest,
    type UserListingRequest,
    type UserListingResponse,
    type UserResponse,
} from 'models/user';
import {ApiBaseService} from '../api_base.service';

export class UserService extends ApiBaseService {
    public getAllUsers(data: UserListingRequest): Promise<ApiResponse<PaginationResponseModel<UserListingResponse>>> {
        return this.get(apiRoutes.user.getAll(data));
    }

    public getAllClientUsers(
        data: UserListingRequest,
    ): Promise<ApiResponse<PaginationResponseModel<UserListingResponse>>> {
        return this.get(apiRoutes.user.getAllClientUsers(data));
    }
    public getAllUserDivisions(
        data: UserDivisionListingRequest,
    ): Promise<ApiResponse<PaginationResponseModel<DivisionResponse>>> {
        return this.get(apiRoutes.user.getAllUserDivisions(data));
    }
    public create(value: UserCreateEditRequestMapping): Promise<ApiResponse<UserResponse>> {
        return this.post(apiRoutes.user.create(), value);
    }
    public update(value: UserCreateEditRequestMapping, id: string): Promise<ApiResponse<UserResponse>> {
        return this.put(apiRoutes.user.update(id), value);
    }
    public getById(id: string): Promise<ApiResponse<UserResponse>> {
        return this.get(apiRoutes.user.getById(id));
    }
    public getUserProfileById(id: string): Promise<ApiResponse<UserResponse>> {
        return this.get(apiRoutes.user.getUserProfileById(id));
    }

    public updateStatus(req: StatusUpdateRequest): Promise<ApiResponse<StatusUpdateResponse>> {
        return this.put(apiRoutes.user.updateStatus(req.Id), {Status: req.Status});
    }

    public updateProfile(id: string, user?: UserCreateEditRequestMapping): Promise<ApiResponse<UserResponse>> {
        return this.put(apiRoutes.user.updateUserProfile(id), user);
    }

    public sendVerificationEmail(id: string): Promise<ApiResponse<boolean>> {
        return this.get(apiRoutes.user.sendVerificationEmail(id));
    }
    public updateProfileImage(userId: string, files: File[]): Promise<ApiResponse<UserResponse>> {
        const bodyFormData = new FormData();

        if (files?.length) {
            for (let i = 0; i < files.length; i++) {
                bodyFormData.append(`files[${i}]`, files[i]);
            }
        }
        bodyFormData.append('body', JSON.stringify({UserId: userId}));

        return this.put(apiRoutes.user.updateUserProfileImage(), bodyFormData, {
            headers: {'Content-Type': 'multipart/form-data'},
        });
    }
}
