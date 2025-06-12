// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-copy-tabs-filepath" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('vscode-copy-tabs-filepath.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from vscode-copy-tabs-filepath!');
	});

	// Show QuickPick with two options in English
	const showCopyOptionsDisposable = vscode.commands.registerCommand('vscode-copy-tabs-filepath.copyFilePath', async function () {
		const options = [
			{ label: 'Copy Path', value: 'path' },
			{ label: 'Copy Filename', value: 'name' }
		];
		const selected = await vscode.window.showQuickPick(options, { placeHolder: 'Select what to copy' });
		if (!selected) return;
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) {
			vscode.window.showWarningMessage('No active editor');
			return;
		}
		if (selected.value === 'path') {
			const filePath = activeEditor.document.uri.fsPath;
			vscode.env.clipboard.writeText(filePath);
			vscode.window.showInformationMessage('Copied file path: ' + filePath);
		} else if (selected.value === 'name') {
			const fileName = activeEditor.document.uri.fsPath.split(/[/\\]/).pop();
			vscode.env.clipboard.writeText(fileName);
			vscode.window.showInformationMessage('Copied file name: ' + fileName);
		}
	});
	context.subscriptions.push(showCopyOptionsDisposable);

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
