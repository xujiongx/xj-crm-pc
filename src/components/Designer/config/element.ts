import { CarouselElementRender } from '@aicc/designer/es/elements/Carousel';
import { ImageElementRender } from '@aicc/designer/es/elements/Image';
import { NavigationElementRender } from '@aicc/designer/es/elements/Navigation';
import { TitleElementRender } from '@aicc/designer/es/elements/Title';
import { ElementTypes } from '@aicc/designer/es/interface';
import { CourseElementRender } from '../elements/Course';
import { LiveElementRender } from '../elements/Live';
import { MomentElementRender } from '../elements/Moment';
import { PartnerElementRender } from '../elements/Partner';
import { ProgramElementRender } from '../elements/Program';
import { TextElementRender } from '../elements/Text';
import { VideoElementRender } from '../elements/Video';
import { CustomerElementTypes } from '../interface';

export const ElementTypeMap: Record<string, any> = {
  [ElementTypes.IMAGE]: ImageElementRender,
  [ElementTypes.CAROUSEL]: CarouselElementRender,
  [ElementTypes.NAVIGATION]: NavigationElementRender,
  [ElementTypes.TITLE]: TitleElementRender,
  // [CustomerElementTypes.DEMO]: DemoElementRender,
  [CustomerElementTypes.COURSE_APPLY]: CourseElementRender,
  [CustomerElementTypes.TEXT_APPLY]: TextElementRender,
  [CustomerElementTypes.PARTNER_APPLY]: PartnerElementRender,
  [CustomerElementTypes.VIDEO_APPLY]: VideoElementRender,
  [CustomerElementTypes.PROGRAM_APPLY]: ProgramElementRender,
  [CustomerElementTypes.LIVE_APPLY]: LiveElementRender,
  [CustomerElementTypes.MOMENT_APPLY]: MomentElementRender,
};
