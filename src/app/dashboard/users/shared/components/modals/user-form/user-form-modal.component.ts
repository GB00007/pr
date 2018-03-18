import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  Input,
  Component,
  ViewChild,
  AfterContentInit
} from '@angular/core';

import {
  keys,
  omit,
  merge,
  forIn,
  omitBy,
  pickBy,
  values,
  isEmpty,
  isEqual,
  mapValues,
  difference
} from 'lodash';

import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal }   from '@ng-bootstrap/ng-bootstrap';
import {
  Bounds,
  CropPosition,
  CropperSettings,
  ImageCropperComponent
} from 'ngx-img-cropper';

import { DetailedUser, ObjectOfBooleans }        from 'AppModels';
import { ValidationHelper, NotificationsHelper } from 'AppHelpers';
import { PermissionsHelper }                     from 'DashboardHelpers';
import { UserService, LcUploadService }          from 'DashboardServices';
import {
  REGEX,
  RESOURCES,
  CROPPER_RK_LOGO,
  SUPPORTED_LANGUAGES,
  CROPPER_RK_LOGO_COVER_POSITION
} from 'Config';

@Component({
  selector: 'app-user-form-modal',
  templateUrl: './user-form-modal.component.html',
  styleUrls: ['./user-form-modal.component.scss']
})
export class UserFormModalComponent implements AfterContentInit {
  @Input() user?:                any;
  @Input() businessSector:       any;
  // @Input() nbrCooks:             number;
  // @Input() nbrBarmen:            number;
  @Input() notificationMessage?: string;
  @Input() items:                string[];
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;

  public nbrUsers:            any;
  public permissions:         any;
  public pictureData:         any;
  public showPassword:        boolean;
  public confirmRole:         boolean;
  public showConfirmPassword: boolean;
  public userForm:            FormGroup;
  public newUser:             DetailedUser;
  public roles:               string[]        = [];
  public selectedPermissions: string[]        = [];
  public users:               DetailedUser[]  = [];
  public deactivated                          = true;
  public otherUpdatesDone                     = false;
  public checkedPassword                      = false;
  public languages:           any[]           = SUPPORTED_LANGUAGES;
  public user_avatars_url                     = `/w_114,h_114,c_lfill/`;
  public cropperRkLogo:       CropperSettings = merge(new CropperSettings(), CROPPER_RK_LOGO);
  public cropPosition:        CropPosition    = merge(
    new CropperSettings(),
    CROPPER_RK_LOGO_COVER_POSITION
  );
  public selected:            any             = {
    'page_editor':        false,
    'menus_manager':      false,
    'tables_manager':     false,
    'reductions_manager': false
  };

  private pictureUploaded: boolean;

  constructor(
    public  userService:   UserService,
    public  activeModal:   NgbActiveModal,
    private uploadService: LcUploadService,
    public  translate:     TranslateService,
    private notifier:      NotificationsHelper
  ) {}

  getDividerColor(field: any): string {
    return ValidationHelper.getDividerColor(field);
  }

  ngAfterContentInit(): void {
    const
      emailValidators: ((control: any) => any)[] = [
        Validators.required,
        ValidationHelper.emailValidator
      ],
      passwordValidators: ((control: any) => any)[] = [
        Validators.required,
        ValidationHelper.passwordValidator
      ];
    this.userForm       = new FormGroup({
      language:           new FormControl(this.user ? this.user.language : ''),
      internal_reference: new FormControl(this.user ? this.user.internal_reference : ''),
      role:               new FormControl(this.user ? this.user.role : '', Validators.required),
      lastname:           new FormControl(this.user ? this.user.lastname : '', Validators.required),
      firstname:          new FormControl(
        this.user ? this.user.firstname : '',
        Validators.required
      ),
      email:              new FormControl(
        this.user ? this.user.email.email : '',
        Validators.compose(emailValidators)
      ),
      password:           new FormControl(
        '',
        this.user ? ValidationHelper.passwordValidator : Validators.compose(passwordValidators)
      ),
      confirm_password:   new FormControl(
        '',
        this.user ? ValidationHelper.passwordValidator : Validators.compose(passwordValidators)
      )
    }, ValidationHelper.matchingPasswords('password', 'confirm_password'));
    this.userService.getRoles(this.businessSector).subscribe(
      (roles: any): void => this.roles = roles,
      console.log
    );
    if (this.user) {
      // this.nbrUsers       = {
      //   cook: this.nbrCooks,
      //   barman: this.nbrBarmen
      // };
      this.permissions    = PermissionsHelper.formatPermissions(this.items);
      if (isEqual(this.items, this.user.permissions)) {
        this.toggleAll();
      } else {
        forIn(this.permissions, (permission: any[], key: string): void => {
          // tslint:disable-next-line:max-line-length
          if (isEqual(permission.sort(), (PermissionsHelper.formatPermissions(this.user.permissions, key) as string[]).sort())) {
            this.toggleAll(key);
          }
        });
      }
      // if (this.nbrUsers[this.user.role] === 1) {
      //   this.userForm.get('role').disable();
      // }
    }
  }

  // openUsersList() {
  //   this.activeModal.close({openUsersList: true});
  // }

  // lastUserRole(): boolean {
  //   return this.nbrUsers[this.user.role] === 1;
  // }

  checkEqualPassword(): void {
    let passwordValue, confirmeValue;
    passwordValue = this.userForm.controls['password'];
    confirmeValue = this.userForm.controls['confirm_password'];
    /* tslint:disable */
    if ((passwordValue.value).length !== 0 &&  (confirmeValue.value).length !== 0 && passwordValue.value !== confirmeValue.value) {
    /* tslint:enable */
      this.checkedPassword = true;
    } else {
      this.checkedPassword = false;
    }
  }

  toggleAll(target?: string): void {
    let targetPermissions;
    if (target) {
      if (this.permissions[target] && this.permissions[target].length !== 0) {
        this.selectedPermissions = this.selectedPermissions.concat(this.permissions[target]);
        this.permissions[target] = [];
      } else {
        targetPermissions        = PermissionsHelper.formatPermissions(this.items, target);
        this.selectedPermissions = difference(this.selectedPermissions, targetPermissions);
        this.permissions[target] = targetPermissions;
      }
      /* tslint:disable */
      if (values(this.permissions).reduce((result: number, permissionGroup: string[]): number => result + permissionGroup.length, 0) === 0) {
      /* tslint:enable */
        this.permissions = {};
      }
      this.selected[target] = !this.selected[target];
    } else {
      if (isEmpty(this.permissions)) {
        this.permissions         = PermissionsHelper.formatPermissions(this.selectedPermissions);
        this.selectedPermissions = [];
        /* tslint:disable */
        this.selected            = mapValues(this.selected, (terget: boolean): boolean => false);
        /* tslint:enable */
      } else {
        this.selectedPermissions = this.items.slice(0);
        this.permissions         = {};
        /* tslint:disable */
        this.selected            = mapValues(this.selected, (terget: boolean): boolean => true);
        /* tslint:enable */
      }
    }
  }

  isFormInvalid(): boolean {
    let noNewPassword: boolean, valuesNotChanged: boolean;
    valuesNotChanged = isEqual(
      omit(this.userForm.value, ['confirm_password', 'password']),
      merge(
        {},
        omit(
          this.user,
          ['id', 'birthday', 'email', 'permissions', 'isEnabled', 'pinCode', 'picture']
        ),
        {email: this.user.email.email}
      )
    );
    noNewPassword = this.userForm.value.password === '';
    return this.userForm.invalid || (valuesNotChanged && noNewPassword && !this.pictureData);
  }

  checkIfWaiter(event: any, role: string): void {
    if (role !== event.value && role === 'waiter') {
      this.confirmRole = true;
    }
  }

  revoke(): void {
    this.userService.updateWaiterTables({waiter_id: this.user.id, tables: ''}).subscribe(
      (data: any): any => {
        this.notifier.success(
          this.translate.instant('waiterTablesRemovedTitle'),
          this.translate.instant('waiterTablesRemovedMessage')
        );
        this.confirmRole = false;
      },
      console.log
    );
  }

  revertRoleChange(): void {
    this.confirmRole = false;
    this.userForm.get('role').setValue(this.user.role);
  }

  uploadFile(event): void {
    this.deactivated = false;
    // tslint:disable:max-line-length
    this.uploadService.getSignature(RESOURCES.CLOUDINARY_FOLDER_IDENTIFIERS.FOLDER_PIC_USERS_AVATARS.key).subscribe(
      (signatureData: any): any => this.uploadService.uploadFile(event.srcElement.files[0], signatureData).subscribe(
        // tslint:enable:max-line-length
        (data: any): void => {
          this.pictureData     = data;
          this.pictureUploaded = true;
          this.deactivated     = true;
          // add success notification
        },
        (error: any): void => {
          console.log('Could not upload file.', error);
          // add error notification
        }
      ),
      (error: any): void => {
        console.log('Could not get signature to upload file.', error);
        // add error notification
      }
    );
  }

  addUser(): void {
    let newUser, formValue;
    // if (this.userForm.dirty && this.userForm.valid && !isEmpty(this.selectedPermissions)){
    if (this.userForm.dirty && this.userForm.valid) {
      formValue = this.userForm.value;
      newUser   = {
        permissions:      this.items,
        role:             formValue.role,
        email:            formValue.email,
        lastname:         formValue.lastname,
        language:         formValue.language,
        password:         formValue.password,
        firstname:        formValue.firstname,
        confirm_password: formValue.confirm_password
      };
      if (formValue.internal_reference) {
        newUser.internal_reference = formValue.internal_reference;
      }
      if (this.pictureUploaded) {
        newUser.avatar = this.pictureData.public_id;
      }
      this.userService.addUser(newUser).subscribe(
        (data: any): void => {
          this.newUser = {};
          this.activeModal.close(merge(data, {isEnabled: true}));
          this.notifier.success(
            this.translate.instant('AdduserModalTitle'),
            this.translate.instant('addUserModalSuccessfully')
          );
        },
        (error: any): void => {
          this.notifier.error(
            this.translate.instant('Error'),
            this.translate.instant(error.error_code)
          );
        }
      );
    }
  }

  editUser(): void {
    const allUpdatesStatus: ObjectOfBooleans = {};
    let
      newUser:         any,
      formValues:      any,
      userPermissions: any,
      newPermissions:  string[];
    const
      // tslint:disable-next-line:max-line-length
      removeEmpty:     any      = (value: any, key: string): boolean => isEmpty(value) || (key !== 'email' ? this.user[key] === value : this.user[key].email === value),
      isAllUpdatesFinished: () => boolean = (): boolean => {
        length = keys(allUpdatesStatus).length;
        // tslint:disable-next-line:max-line-length
        return (length >= 2) && (keys(pickBy(allUpdatesStatus, (value: boolean): boolean => !value)).length === 0);
      };
    newUser = {user_id: this.user.id};
    if (this.userForm.valid) {
      formValues       = this.userForm.value;
      this.permissions = PermissionsHelper.formatPermissions(this.items);
      newUser = merge({}, newUser, omitBy(omit(formValues, ['role', 'permissions']), removeEmpty));
      if (formValues.role !== '' && formValues.role !== this.user.role) {
        this.userService.updateUserRole({user: this.user.id, role: formValues.role}).subscribe(
          (data: any): void => {
            newUser.role = formValues.role;
            if (isAllUpdatesFinished()) {
              this.activeModal.close(newUser);
            } else {
              allUpdatesStatus['userRole'] = true;
            }
            newPermissions  = [];
            userPermissions = {};
          },
          (error: any): void => console.log('Could not update user.', error)
        );
      } else {
        allUpdatesStatus['userRole'] = true;
      }
      newPermissions = keys(
        pickBy(
          this.selected,
          (permissionGroup: any): boolean => permissionGroup
        )
      ).reduce(
        // tslint:disable-next-line:max-line-length
        (result: any, permissionGroupName: string): string[] => result.concat((PermissionsHelper.formatPermissions(this.items, permissionGroupName) as string[])),
        []
      );
      // temporary until we resolve permissions problem.
      allUpdatesStatus['userPermissions'] = true;
      // if (!isEqual(newPermissions.sort(), this.user.permissions.sort())) {
      //   newUser.permissions = newPermissions;
      //   userPermissions     = {user: this.user.id, permissions: newPermissions};
      //   this.userService.updateUserPermissions(userPermissions).subscribe(
      //     (data: any): void => {
      //       if (isAllUpdatesFinished()) {
      //         this.dialog.close(newUser);
      //       } else {
      //         allUpdatesStatus['userPermissions'] = true;
      //       }
      //       newPermissions  = [];
      //       userPermissions = {};
      //     },
      //     (error: any): void => console.log('Could not add user.')
      //   );
      // } else {
      //   allUpdatesStatus['userPermissions'] = true;
      // }
      if (this.pictureUploaded) {
        newUser.avatar = this.pictureData.public_id;
      }
      if (keys(newUser).length > 1) {
        this.userService.updateUser(newUser).subscribe(
          (data: any): void => {
            this.newUser = {};
            // tslint:disable-next-line:max-line-length
            if ((isEqual(newPermissions.sort(), this.user.permissions.sort())) || ((!isEqual(newPermissions.sort(), this.user.permissions.sort())) && isAllUpdatesFinished())) {
              if (!isEqual(newPermissions.sort(), this.user.permissions.sort())) {
                newUser.permissions = newPermissions;
              }
              this.activeModal.close(newUser);
            } else {
              allUpdatesStatus['userData'] = true;
            }
          },
          (error: any): void => console.log('Could not update user.', error)
        );
      } else {
        allUpdatesStatus['userData'] = true;
      }
    }
  }
}
