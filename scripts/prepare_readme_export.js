const slugify = require("slugify");
fs = require('fs');

function getFrontMatterProperty(file, property) {
    let content = fs.readFileSync(file, 'utf8')
    const re = new RegExp(`${property}: "?([^"$\n]+)("|$)`, "gm");

    return re.exec(content)[1];
}

let category = getFrontMatterProperty('./docs/README.md', "category");
let hidden = getFrontMatterProperty('./docs/README.md', "hidden");

function addFrontMatterProperty(file, property) {
    let content = fs.readFileSync(file, 'utf8')
    let updatedContent = content.replace(/---\n/, `---\n${property}\n`);

    fs.writeFileSync(file, updatedContent);
}

function removeFrontMatterProperty(file, property) {
    let content = fs.readFileSync(file, 'utf8')
    let updatedContent = content.replace(/title: .*\n/, ``);

    fs.writeFileSync(file, updatedContent);
}

function createFolderAndMoveDocs(baseDir, folderName, namespace, title) {
    let files = fs.readdirSync(baseDir+ '/' + folderName, { withFileTypes: true });
    let parentDocSlug = slugify(`node-sdk API reference ${title}`, {lower: true, strict: true});

    let header = `---
title: "${title}"
category: "${category}"
slug: "${parentDocSlug}"
hidden: ${hidden}
---

### ${title}

`;

    let toc = files
    .filter(f => f.isFile())
    .map(f => {
        const titleRe = /title: "(.+)".*/g;
        let title = titleRe.exec(fs.readFileSync(baseDir + '/' + folderName + "/" + f.name, 'utf8'))[1];
        return "- [" + title + "](" + folderName + "/" + f.name + ")"
    })
    .join('\n')

    fs.writeFileSync(
        baseDir + '/' + folderName +'.md',
        header + toc
    );

    // add slug parameter to frontmatter in every file in folder
    files.filter(f => f.isFile()).forEach(f => {
        let file = baseDir+ '/' + folderName + "/" + f.name;

        let childTitle = getFrontMatterProperty(file, 'title')
        let slug = slugify(`node-sdk API reference ${title} ${childTitle}`, {lower: true, strict: true})

        addFrontMatterProperty(file, `slug: "${slug}"`);
        addFrontMatterProperty(file, `parentDocSlug: "${parentDocSlug}"`);
    });
}

function mergeReadmeAndModules() {
    let toc = fs.readFileSync('./docs/modules.md', 'utf8')
    fs.rmSync('./docs/modules.md');

    toc = toc.replace(/.*## Index/s, '');

    let readme = fs.readFileSync('./docs/README.md', 'utf8') + "\n## Index" + toc;
    fs.writeFileSync('./docs/README.md', readme);
}

mergeReadmeAndModules();
addFrontMatterProperty('./docs/README.md', `order: 10`);
removeFrontMatterProperty('./docs/README.md', 'title');
addFrontMatterProperty('./docs/README.md', 'title: "Overview"');
let overviewSlug = slugify(`node-sdk API reference overview`, {lower: true, strict: true});
addFrontMatterProperty('./docs/README.md', `slug: "${overviewSlug}"`);

createFolderAndMoveDocs('docs', 'variables', 'global', 'Variables');

function flattenNamespace(folder, namespace, fullNamespaceName) {
    const formFile = `./docs/${folder}/${namespace}.md`;
    removeFrontMatterProperty(formFile, 'title');
    addFrontMatterProperty(formFile, `title: "namespace: ${fullNamespaceName}"`);

    let formDocSlug = slugify(`node-sdk API reference namespace ${fullNamespaceName}`, {lower: true, strict: true});
    addFrontMatterProperty(formFile, `slug: "${formDocSlug}"`);
}

flattenNamespace('Zaius', 'Zaius', 'Zaius');
createFolderAndMoveDocs('docs/Zaius', 'classes', 'Zaius', 'Zaius - Classes');
createFolderAndMoveDocs('docs/Zaius', 'interfaces', 'Zaius', 'Zaius - Interfaces');
createFolderAndMoveDocs('docs/Zaius', 'types', 'Zaius', 'Zaius - Types');

flattenNamespace('Zaius/ApiV3', 'ApiV3', 'Zaius.ApiV3');
createFolderAndMoveDocs('docs/Zaius/ApiV3', 'classes', 'Zaius.ApiV3', 'Zaius.ApiV3 - Classes');
createFolderAndMoveDocs('docs/Zaius/ApiV3', 'enums', 'Zaius.ApiV3', 'Zaius.ApiV3 - Enums');
createFolderAndMoveDocs('docs/Zaius/ApiV3', 'functions', 'Zaius.ApiV3', 'Zaius.ApiV3 - Functions');
createFolderAndMoveDocs('docs/Zaius/ApiV3', 'interfaces', 'Zaius.ApiV3', 'Zaius.ApiV3 - Interfaces');
createFolderAndMoveDocs('docs/Zaius/ApiV3', 'types', 'Zaius.ApiV3', 'Zaius.ApiV3 - Types');
createFolderAndMoveDocs('docs/Zaius/ApiV3', 'variables', 'Zaius.ApiV3', 'Zaius.ApiV3 - Variables');

addFrontMatterProperty('./docs/variables.md', `order: 20`);

addFrontMatterProperty('./docs/Zaius/Zaius.md', `order: 30`);
addFrontMatterProperty('./docs/Zaius/classes.md', `order: 40`);
addFrontMatterProperty('./docs/Zaius/interfaces.md', `order: 50`);
addFrontMatterProperty('./docs/Zaius/types.md', `order: 60`);

addFrontMatterProperty('./docs/Zaius/ApiV3/ApiV3.md', `order: 70`);
addFrontMatterProperty('./docs/Zaius/ApiV3/classes.md', `order: 80`);
addFrontMatterProperty('./docs/Zaius/ApiV3/enums.md', `order: 90`);
addFrontMatterProperty('./docs/Zaius/ApiV3/functions.md', `order: 100`);
addFrontMatterProperty('./docs/Zaius/ApiV3/interfaces.md', `order: 110`);
addFrontMatterProperty('./docs/Zaius/ApiV3/types.md', `order: 120`);
addFrontMatterProperty('./docs/Zaius/ApiV3/variables.md', `order: 130`);

function fixLinks(folder) {
    fs.readdirSync(folder, { withFileTypes: true })
        .forEach(f => {
            if (f.isDirectory()) {
                fixLinks(folder + '/' + f.name);
            } else {
                console.log(`file: ${folder}/${f.name}`);
                //[success](LiquidExtensionResult.md#success)
                let content = fs.readFileSync(`${folder}/${f.name}`, 'utf8')
                content = content.replaceAll("modules.md", "README.md");

                let linkRe = /\]\(([^\)]*\.md)/g;
                let m;
                do {
                    m = linkRe.exec(content);
                    if (m) {
                        let link = m[1];
                        let targetSlug = getFrontMatterProperty(folder + "/" + link, "slug");
                        console.log(`Replacing ${link} with ${targetSlug}`);
                        content = content.replaceAll(m[1], targetSlug);
                    }
                } while (m);

                fs.writeFileSync(`${folder}/${f.name}`, content);
            }
        });
}

fixLinks('docs');
