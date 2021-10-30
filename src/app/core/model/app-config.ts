export class AppConfig {
    copyrightNotice?: string;
    cssConfig?: CSSConfig;
}

export class CSSConfig {
    primary?: Color;
    secondary?: Color;
    tertiary?: Color;
    canvasLevel1?: Color;
    canvasLevel2?: Color;
    canvasLevel3?: Color;
    canvasLevel4?: Color;
    canvasLevel5?: Color;
    canvasLevel6?: Color;
    canvasLevel7?: Color;
    canvasLevel8?: Color;
    font?: Font;
    hyperlink?: Color;
    infocus?: Color;

    dialogFooterBar?: string;
    dialogHeaderBar?: string;
    leftPanel?: string;
    leftPanelMenuItem?: string;
    logoUrl?: string;
    topBar?: string;
}

export class Color {
    foregroundColour?: string;
    backgroundColour?: string;
}

export class Font {
    printFontFamily?: string;
    screenFontFamily?: string;
}