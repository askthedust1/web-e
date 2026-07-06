import React, {FC} from "react";

import Banner from "components/Banner";


interface NavigationItem {
    id: number,
    name: string,
    slug: string;
}
interface TransfersLayoutProps {
    children: React.ReactNode;
    bannerTitle: string
    bannerSubtitle: string
    bannerLink: string
    bannerLinkText: string
    bannerImage: string
    bannerImageMobi: string
    navigation: Array<NavigationItem>
}

const TransfersLayout: FC<TransfersLayoutProps> =
    ({
         children, bannerTitle, bannerSubtitle, bannerLink,
         bannerLinkText, bannerImage, bannerImageMobi, navigation: _navigation
     }: TransfersLayoutProps) => {
        return (
            <>
                <Banner
                    title={bannerTitle}
                    subtitle={bannerSubtitle}
                    link={bannerLink}
                    linkText={bannerLinkText}
                    imagePath={bannerImage}
                    imagePathMobile={bannerImageMobi}
                />
                {children}
            </>
        );
    };

export default TransfersLayout;
