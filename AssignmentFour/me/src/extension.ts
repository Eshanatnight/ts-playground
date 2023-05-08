import * as vscode from "vscode";
import * as http from "http";

const url = "http://localhost:3000/vscode.html";

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "me" is now active!');
	let currentPanel: vscode.WebviewPanel | undefined = undefined;

	context.subscriptions.push(
		vscode.commands.registerCommand("me.WebView", () => {
			const colToShowIn: vscode.ViewColumn | undefined = vscode.window
				.activeTextEditor
				? vscode.window.activeTextEditor.viewColumn
				: undefined;

			if (currentPanel) {
				currentPanel.reveal(colToShowIn);
			} else {
				currentPanel = vscode.window.createWebviewPanel(
					"catCoding",
					"Cat Coding",
					vscode.ViewColumn.One,
					{}
				);

				let counter: number = 0;
				const updateWebview = async () => {
					const cat: "compilingCat" | "codingCat" =
						counter++ % 2 === 0 ? "compilingCat" : "codingCat";
					if(currentPanel){
						currentPanel.title = cat;
						currentPanel.webview.options = getWebviewOptions(context.extensionUri);
						currentPanel.webview.html = await getHTML();
					}
				};
				updateWebview();
				let interval = setInterval(updateWebview, 1000);

				currentPanel.onDidDispose(
					() => {
						console.log("dispose");
						clearInterval(interval);
					},
					null,
					context.subscriptions
				); 
			}
		})
	);
}

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
	return {
		// Enable javascript in the webview
		enableScripts: true,

		// And restrict the webview to only loading content from our extension's `media` directory.
		localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
	};
} 

function getHTML(): Promise<string> {
	return new Promise((resolve, reject) => {
		http.get(url, (res) => {
			let data = "";
			res.on("data", (chunk) => {
				data += chunk;
			});
			res.on("end", () => {
				resolve(data);
			});
		}).on("error", (err) => {
			reject(err);
		});
	});
}


function getWebViewContext() {
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Cat Coding</title>
	</head>
	<body>
		<button id="button">Click Me</button>
		<div id="image">
		</div>
	</body>
	</html>`;
}

export function deactivate() {}
