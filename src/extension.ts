import * as vscode from "vscode";
import * as pidCwd from "pid-cwd";

const CMD_RENAME_WITH_ARG = "workbench.action.terminal.renameWithArg";

const log = (...args: any[]) => console.log(`[Terminamer]`, ...args);

export function activate(context: vscode.ExtensionContext) {
  log("now watching for new terminals…");

  const handler = vscode.window.onDidOpenTerminal(async (terminal) => {
    const processId = await terminal.processId;
    if (processId) {
      const cwd = await pidCwd(processId);
      const folder = vscode.workspace.getWorkspaceFolder(vscode.Uri.parse(cwd));

      if (folder && terminal.creationOptions.name === undefined) {
        const name = folder.name;
        log(`renaming anonymous terminal to "${name}"`);
        vscode.commands.executeCommand(CMD_RENAME_WITH_ARG, { name });
      } else {
        log(`ignoring named terminal ${terminal.creationOptions.name}`);
      }
    }
  });

  context.subscriptions.push(handler);
}

// this method is called when your extension is deactivated
export function deactivate() {}
