import { IAccessInfo } from './iaccess-info';
import { ISaleInfo } from './isale-info';
import { IVolumeInfo } from './ivolume-info';

export interface IBook {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: IVolumeInfo;
  saleInfo: ISaleInfo;
  accessInfo: IAccessInfo;
  searchInfo: {
    textSnippet: string;
  };
}
