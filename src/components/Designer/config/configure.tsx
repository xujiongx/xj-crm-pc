import { CarouselConfigRender } from '@aicc/designer/es/elements/Carousel';
import { ImageConfigRender } from '@aicc/designer/es/elements/Image';
import { NavigationConfigRender } from '@aicc/designer/es/elements/Navigation';
import { TitleConfigRender } from '@aicc/designer/es/elements/Title';
import { ElementTypes } from '@aicc/designer/es/interface';
import { CourseConfigRender } from '../elements/Course';
import { DemoConfigRender } from '../elements/Demo';
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
    component: (props) => <CourseConfigRender {...props} />,
  },
  [CustomerElementTypes.TEXT_APPLY]: {
    component: (props) => <TextConfigRender {...props} showCover={false} />,
  },
  [CustomerElementTypes.PARTNER_APPLY]: {
    component: (props) => <PartnerConfigRender {...props} />,
  },
  [CustomerElementTypes.VIDEO_APPLY]: {
    component: (props) => <VideoConfigRender {...props} />,
  },
  [CustomerElementTypes.PROGRAM_APPLY]: {
    component: (props) => <ProgramConfigRender {...props} />,
  },
  [CustomerElementTypes.LIVE_APPLY]: {
    component: (props) => <LiveConfigRender {...props} />,
  },
  [CustomerElementTypes.MOMENT_APPLY]: {
    component: (props) => <MomentConfigRender {...props} />,
  },
  [CustomerElementTypes.DEMO]: {
    component: (props) => <DemoConfigRender {...props} />,
  },
};
