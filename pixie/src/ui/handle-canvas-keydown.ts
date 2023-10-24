import React from 'react';
import {isCtrlKeyPressed} from '../common/utils/keybinds/is-ctrl-key-pressed';
import {tools} from '../state/utils';

export function handleCanvasKeydown(e: React.KeyboardEvent) {
  switch (e.key) {
    case 'z':
      if (isCtrlKeyPressed(e)) {
        e.preventDefault();
        e.stopPropagation();
        if (e.shiftKey) {
          tools().history.redo();
        } else {
          tools().history.undo();
        }
      }
      break;
    case 'ArrowUp':
      e.preventDefault();
      e.stopPropagation();
      tools().objects.move('up');
      break;
    case 'ArrowRight':
      e.preventDefault();
      e.stopPropagation();
      tools().objects.move('right');
      break;
    case 'ArrowDown':
      e.preventDefault();
      e.stopPropagation();
      tools().objects.move('down');
      break;
    case 'ArrowLeft':
      e.preventDefault();
      e.stopPropagation();
      tools().objects.move('left');
      break;
    case 'Delete':
      e.preventDefault();
      e.stopPropagation();
      tools().objects.delete();
      break;
    default:
  }
}
