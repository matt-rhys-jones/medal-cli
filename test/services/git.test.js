import { expect } from 'chai';
import sinon from 'sinon';
import shell from 'shelljs';
import git from '../../src/services/git';

describe('services/git.js', () => {
    describe('when verifying whether git is installed', () => {
        it('should call shell.which with git as a parameter', () => {
            sinon.stub(shell, 'which');
            sinon.stub(shell, 'exit');

            git.verifyGit();
            sinon.assert.calledOnce(shell.which);
            sinon.assert.calledWith(shell.which, 'git');

            shell.exit.restore();
            shell.which.restore();
        });

        describe('and git is not installed', () => {
            it('should call shell.exit with an error code', () => {
                sinon.stub(shell, 'which').returns(false);
                sinon.stub(shell, 'exit');

                git.verifyGit();
                sinon.assert.calledOnce(shell.exit);
                sinon.assert.calledWith(shell.exit, 1);

                shell.which.restore();
                shell.exit.restore();
            });
        });

        describe('and git is installed', () => {
            it('should not call shell.exit', () => {
                sinon.stub(shell, 'which').returns(true);
                sinon.stub(shell, 'exit');

                git.verifyGit();
                sinon.assert.callCount(shell.exit, 0);

                shell.which.restore();
                shell.exit.restore();
            });
        });
    });

    describe('when cloning a repository', () => {
        it('should pass git clone through to shell exec', async () => {
            const source = 'a';
            const tag = 'b';
            const target = 'c';
            const expected = `git clone ${source} ${target}`;
            
            sinon.stub(shell, 'exec').resolves({ code: 0 });
            sinon.stub(shell, 'rm');

            await git.clone(source, tag, target);
            sinon.assert.called(shell.exec);
            sinon.assert.calledWith(shell.exec, expected);

            shell.exec.restore();
            shell.rm.restore();
        });

        describe('and git clone succeeds', () => {
            it('should checkout the correct tag', async () => {
                const source = 'a';
                const tag = 'b';
                const target = 'c';
                const expected1 = 'git fetch --all --tags';
                const expected2 = `git checkout tags/${tag}`;
                const silent = { silent: true };

                sinon.stub(shell, 'exec').resolves({ code: 0 });
                sinon.stub(shell, 'rm');
    
                await git.clone(source, tag, target);
                sinon.assert.calledWith(shell.exec, expected1, silent);
                sinon.assert.calledWith(shell.exec, expected2, silent);
                sinon.assert.calledWith(shell.rm, '-rf', '.git', silent);

                shell.exec.restore();
                shell.rm.restore();
            });
        });

        describe('and git clone fails', () => {
            it('should throw an error', async () => {
                let didThrow = false;

                sinon.stub(shell, 'exec').resolves({ code: 1 });
                sinon.stub(shell, 'rm');

                try {
                     await git.clone('a', 'b', 'c');
                } catch(e) {
                    didThrow = true;
                }
               
                expect(didThrow).to.equal(true);

                shell.exec.restore();
                shell.rm.restore();
            });
        });
    });
});
