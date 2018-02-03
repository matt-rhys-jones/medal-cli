import shell from 'shelljs';

const clone = async (source, tag, target) => {
    const cloneOutput = await shell.exec(`git clone ${source} ${target}`);

    if (cloneOutput.code > 0) {
        throw new Error('Unable to clone git repository.');
    }

    shell.cd(target);
    await shell.exec('git fetch --all --tags', { silent: true });
    await shell.exec(`git checkout tags/${tag}`, { silent: true });
    await shell.rm('-rf', '.git', { silent: true });
}

const verifyGit = () => {
    if (!shell.which('git')) {
        shell.echo('Unable to clone repository, please ensure you have git installed');
        shell.exit(1);
    }
}

export default {
    clone,
    verifyGit
}
