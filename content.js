// content.js
const replacements = [
    { from: "user", to: "maker" },
    { from: "users", to: "makers" },
    { from: "ユーザー", to: "メイカー" },
    { from: "ユーザ", to: "メイカー" },
    { from: "生産", to: "保存" },
    { from: "消費", to: "維持" }
];

function replaceText(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        let content = node.textContent;
        replacements.forEach(({ from, to }) => {
            const regex = new RegExp(from, 'gi');
            content = content.replace(regex, match => {
                if (match === match.toUpperCase()) return to.toUpperCase();
                if (match === match.toLowerCase()) return to.toLowerCase();
                if (match === match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()) {
                    return to.charAt(0).toUpperCase() + to.slice(1).toLowerCase();
                }
                return to;
            });
        });
        if (content !== node.textContent) {
            node.textContent = content;
        }
    } else {
        for (let i = 0; i < node.childNodes.length; i++) {
            replaceText(node.childNodes[i]);
        }
    }
}

function observeAndReplace(mutations) {
    for (let mutation of mutations) {
        for (let node of mutation.addedNodes) {
            replaceText(node);
        }
    }
}

// 初期置換
replaceText(document.body);

// 動的コンテンツの監視
const observer = new MutationObserver(observeAndReplace);
observer.observe(document.body, { childList: true, subtree: true });

// ページの完全な読み込み後に再度置換を実行
window.addEventListener('load', () => replaceText(document.body));
