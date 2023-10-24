import {state, tools} from '../state/utils';
import {PixieConfig} from '../config/default-config';

export function resetEditor(config?: PixieConfig): Promise<void> {
  // reset UI
  tools().canvas.clear();
  tools().frame.remove();

  // remove previous image and canvas size
  state().setConfig({image: undefined, blankCanvasSize: undefined, ...config});

  state().reset();

  return new Promise<void>(resolve => setTimeout(resolve));
}
