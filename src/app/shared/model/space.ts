export class Space {
  supGuid!: string;
  supCustomerId!: string;
  supDataCategory!: string;
  supInvariantGuid!: string;
  supCreatedTimestamp!: string;
  supLastUpdateTimestamp!: string;
  supUniversalIndex!: string;
  supVersionNo!: string;
  supVersionEffectiveFrom!: string;
  supVersionEffectiveTo!: string;
  supId!: string;
  supShortTitle!: string;
  supTitle!: string;
  supDescription!: string;
  supAlias1ShortTitle!: string;
  supAlias2ShortTitle!: string;
  supAlias3ShortTitle!: string;
  supAlias1Title!: string;
  supAlias2Title!: string;
  supAlias3Title!: string;
  supAlias1Description!: string;
  supAlias2Description!: string;
  supAlias3Description!: string;
  supManagementName!: string;
  supInternalName!: string;
  supImplmentationName!: string;
  supUri!: string;
  corIsReference!: boolean;
  corIsProvisional!: boolean;
  corStereoTypeName!: string;
  corVersionMarker!: string;
  corPublicationState!: string;
  corSource!: string;
  corFullTitle!: string;
  id!: string;
  libSupId!: string;
  libSupGuId!: string;
  libSupTitle!: string;
  spcLatestIssue!: string;
  spcCopyrightNotice!: string;
  spcScreenCSSfileName!: string;
  spcPrintCSSfileName!: string;
  spcEmailPreFix!: string;
  spcLogofileName!: string;
  spcMailCSSfileName!: string;
  spcConditionsOfUse!: string;
  spcUserNotice!: string;
  spcDurationOfRecent!: string;
  spcIsLocked!: string;
  spcNamespaceIndex!: string;
  roles!: string;
  library!: string;
  views!: string;
  links!: string;
  metaLanguage!: string;
}

export class SpaceBasic {
  libId: string;
  libTitle: string;
  spaceId: string;
  spaceTitle: string;
  spaceShortTitle: string;
  spaceSupId: string;

  constructor() {
    this.libId = '';
    this.libTitle = '';
    this.spaceId = '';
    this.spaceTitle = '';
    this.spaceShortTitle = '';
    this.spaceSupId = '';
  }
}
