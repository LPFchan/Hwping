import type { CommandDef } from '../types';
import { OptionsDialog } from '../../ui/options-dialog';

export const toolCommands: CommandDef[] = [
  {
    id: 'tool:options',
    label: 'Preferences…',
    execute(_services) {
      const dlg = new OptionsDialog();
      dlg.show();
    },
  },
];
