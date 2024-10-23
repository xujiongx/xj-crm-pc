import { CarouselConfigRender } from '@aicc/designer/es/elements/Carousel';
import { ImageConfigRender } from '@aicc/designer/es/elements/Image';
import { NavigationConfigRender } from '@aicc/designer/es/elements/Navigation';
import { TitleConfigRender } from '@aicc/designer/es/elements/Title';
import { ElementTypes } from '@aicc/designer/es/interface';
import { CourseConfigRender } from '../elements/Course';
import { LiveConfigRender } from '../elements/Live';
import { MomentConfigRender } from '../elements/Moment';
import { PartnerConfigRender } from '../elements/Partner';
import { ProgramConfigRender } from '../elements/Program';
import { TextConfigRender } from '../elements/Text';
import { VideoConfigRender } from '../elements/Video';
import { CustomerElementTypes } from '../interface';

export const ConfigTypeMap: Record<
  ElementTypes & CustomerElementTypes,
  {
    component: () => React.ReactNode;
    config?: { hideTitle?: boolean; hideStyle?: boolean };
  }
> = {
  [ElementTypes.IMAGE]: {
    component: ImageConfigRender,
    config: {
      // hideStyle: true,
    },
  },
  [ElementTypes.CAROUSEL]: {
    component: CarouselConfigRender,
    config: {
      hideTitle: true,
    },
  },
  [ElementTypes.NAVIGATION]: {
    component: NavigationConfigRender,
  },
  [ElementTypes.TITLE]: {
    component: TitleConfigRender,
  },
  // [CustomerElementTypes.DEMO]: {
  //   component: DemoConfigRender,
  // },
  [CustomerElementTypes.COURSE_APPLY]: {
    component: () => <CourseConfigRender />,
  },
  [CustomerElementTypes.TEXT_APPLY]: {
    component: () => <TextConfigRender showCover={false} />,
  },
  [CustomerElementTypes.PARTNER_APPLY]: {
    component: () => <PartnerConfigRender />,
  },
  [CustomerElementTypes.VIDEO_APPLY]: {
    component: () => <VideoConfigRender />,
  },
  [CustomerElementTypes.PROGRAM_APPLY]: {
    component: () => <ProgramConfigRender />,
  },
  [CustomerElementTypes.LIVE_APPLY]: {
    component: () => <LiveConfigRender />,
  },
  [CustomerElementTypes.MOMENT_APPLY]: {
    component: () => <MomentConfigRender />,
  },
};
