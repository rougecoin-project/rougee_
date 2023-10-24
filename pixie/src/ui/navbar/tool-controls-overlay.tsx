import {AnimatePresence, m} from 'framer-motion';
import {FilterControls} from '../../tools/filter/ui/filter-controls';
import {useStore} from '../../state/store';
import {ActiveFrameControls} from '../../tools/frame/ui/active-frame-controls';
import {ActiveTextControls} from '../../tools/text/ui/active-text-controls';
import {ActiveObjectControls} from '../../objects/ui/active-obj-controls/active-object-controls';
import {ActiveToolOverlay} from '../../state/editor-state';

export function ToolControlsOverlay() {
  const activeOverlay = useStore(s => s.activeToolOverlay);
  const activeObjId = useStore(s => s.objects.active.id);
  const overlayCmp = getOverlay(activeOverlay, activeObjId);

  return (
    <div className="relative z-tool-overlay text-sm">
      <AnimatePresence>
        {overlayCmp && (
          <m.div
            initial={{y: 0, opacity: 0}}
            animate={{y: '-100%', opacity: 1}}
            exit={{y: 0, opacity: 0}}
            transition={{type: 'tween', duration: 0.15}}
            key="tool-controls-overlay"
            className="absolute inset-x-0 gap-16 px-5vw bg bg-opacity-95 border-t"
          >
            {overlayCmp}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getOverlay(
  activeOverlay: ActiveToolOverlay | null,
  activeObjId: string | null
) {
  switch (activeOverlay) {
    case ActiveToolOverlay.Filter:
      return <FilterControls />;
    case ActiveToolOverlay.Frame:
      return <ActiveFrameControls />;
    case ActiveToolOverlay.Text:
      return activeObjId && <ActiveTextControls />;
    case ActiveToolOverlay.ActiveObject:
      return activeObjId && <ActiveObjectControls />;
    default:
      return null;
  }
}
