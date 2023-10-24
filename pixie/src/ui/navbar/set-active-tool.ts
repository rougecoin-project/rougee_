import {Object as IObject} from 'fabric/fabric-impl';
import {ObjectName} from '../../objects/object-name';
import {ToolName} from '../../tools/tool-name';
import {ActiveToolOverlay} from '../../state/editor-state';
import {fabricCanvas, state, tools} from '../../state/utils';

export function setActiveTool(name: ToolName | null = null): void {
  // prevent changing of active tool if editor is dirty
  if (state().dirty) {
    return;
  }

  tools().zoom.fitToScreen();

  const [toolName, overlayName] = getToolForObj(
    fabricCanvas().getActiveObject()
  );

  if (name) {
    state().setActiveTool(name, toolName === name ? overlayName : null);
  } else {
    state().setActiveTool(toolName, overlayName);
  }
}

export function getToolForObj(
  obj?: IObject
): [ToolName | null, ActiveToolOverlay | null] {
  switch (obj?.name) {
    case ObjectName.Text:
      return [ToolName.TEXT, ActiveToolOverlay.Text];
    case ObjectName.Sticker:
    case ObjectName.Image:
      return [ToolName.STICKERS, ActiveToolOverlay.ActiveObject];
    case ObjectName.Shape:
      return [ToolName.SHAPES, ActiveToolOverlay.ActiveObject];
    default:
      return [null, null];
  }
}
