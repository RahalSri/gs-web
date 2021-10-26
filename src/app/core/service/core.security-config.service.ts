import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SecurityConfigService {
  isPrimed: boolean = false;
  primePromise: any;

  metrix = {
    securityManager: {
      dashboard: { manage: false, add: false, edit: false, delete: false },
      lookandfeel: { crossOrg: false },
      license: { manage: true, crossOrg: false },
      dataimport: {
        SYS_CONFIG: {
          import: false,
          show_cust_label: false,
          sel_target: false
        },
        CUST_CONFIG: {
          import: false,
          show_cust_label: false,
          sel_target: false
        },
        CUST_LICENSE: {
          import: false,
          show_cust_label: false,
          sel_target: false
        },
        REF_MSG: { import: false, show_cust_label: false, sel_target: false },
        MET_LANG: { import: false, show_cust_label: false, sel_target: false },
        LIB_SPC_CONFIG: {
          import: false,
          show_cust_label: false,
          sel_target: false
        },
        DAT_CONTENT: {
          import: false,
          show_cust_label: false,
          sel_target: false
        },
        SEC_CONFIG: { import: true, show_cust_label: false, sel_target: false },
        change_file_type: true
      },
      template: { adminpanel: true }
    },
    publicationManager: {
      dashboard: { manage: true, add: true, edit: true, delete: true },
      lookandfeel: { crossOrg: false },
      license: { manage: true, crossOrg: false },
      dataimport: {
        SYS_CONFIG: {
          import: false,
          show_cust_label: false,
          sel_target: false
        },
        CUST_CONFIG: {
          import: false,
          show_cust_label: false,
          sel_target: false
        },
        CUST_LICENSE: {
          import: false,
          show_cust_label: false,
          sel_target: false
        },
        REF_MSG: { import: false, show_cust_label: false, sel_target: false },
        MET_LANG: { import: false, show_cust_label: false, sel_target: false },
        LIB_SPC_CONFIG: {
          import: true,
          show_cust_label: false,
          sel_target: false
        },
        DAT_CONTENT: { import: true, show_cust_label: false, sel_target: true },
        SEC_CONFIG: {
          import: false,
          show_cust_label: false,
          sel_target: false
        },
        change_file_type: true
      },
      template: { adminpanel: false }
    },
    instanceManager: {
      dashboard: { manage: false, add: false, edit: false, delete: false },
      lookandfeel: { crossOrg: true },
      license: { manage: true, crossOrg: true },
      dataimport: {
        SYS_CONFIG: { import: true, show_cust_label: true, sel_target: false },
        CUST_CONFIG: { import: true, show_cust_label: true, sel_target: false },
        CUST_LICENSE: {
          import: true,
          show_cust_label: true,
          sel_target: false
        },
        REF_MSG: { import: true, show_cust_label: true, sel_target: false },
        MET_LANG: { import: true, show_cust_label: true, sel_target: false },
        LIB_SPC_CONFIG: {
          import: true,
          show_cust_label: true,
          sel_target: false
        },
        DAT_CONTENT: { import: true, show_cust_label: true, sel_target: true },
        SEC_CONFIG: { import: true, show_cust_label: true, sel_target: false },
        change_file_type: false
      },
      template: { adminpanel: true }
    },
    supportManager: {
      dashboard: { manage: false, add: false, edit: false, delete: false },
      lookandfeel: { crossOrg: false },
      license: { manage: false, crossOrg: false },
      dataimport: {
        SYS_CONFIG: { import: true, show_cust_label: true, sel_target: false },
        CUST_CONFIG: { import: true, show_cust_label: true, sel_target: false },
        CUST_LICENSE: {
          import: true,
          show_cust_label: true,
          sel_target: false
        },
        REF_MSG: { import: true, show_cust_label: true, sel_target: false },
        MET_LANG: { import: true, show_cust_label: true, sel_target: false },
        LIB_SPC_CONFIG: {
          import: true,
          show_cust_label: true,
          sel_target: false
        },
        DAT_CONTENT: { import: true, show_cust_label: true, sel_target: true },
        SEC_CONFIG: { import: true, show_cust_label: true, sel_target: false },
        change_file_type: false
      },
      template: { adminpanel: true }
    }
  };
  getElementAcessPriviledge(module: any, element: any) : any{
    if (element.indexOf('|') == -1) {
      // No nested elements
      return module[element];
    } else {
      var nestedArr = element.split('|');
      var value = nestedArr[0];
      return this.getElementAcessPriviledge(module[value], nestedArr[1]);
    }
  }

  isPrivileged(user: any, module: any, element: any) : any{
    /* To Do: logic of this function will be changed with Central security module */
    var ret = false;
    if (typeof user != 'undefined') {
      if (user.securityManager && !ret) {
        ret = this.getElementAcessPriviledge(
          this.metrix['securityManager'][module],
          element
        );
      }

      if (user.publicationManager && !ret) {
        ret = this.getElementAcessPriviledge(
          this.metrix['publicationManager'][module],
          element
        );
      }

      if (user.instanceManager && !ret) {
        ret = this.getElementAcessPriviledge(
          this.metrix['instanceManager'][module],
          element
        );
      }

      if (user.supportManager && !ret) {
        ret = this.getElementAcessPriviledge(
          this.metrix['supportManager'][module],
          element
        );
      }
    }

    return ret;
  }
}
