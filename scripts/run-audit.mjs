import { spawnSync } from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const environment = { ...process.env, npm_config_ignore_scripts: 'true' };
delete environment.npm_config_allow_scripts;
const result = spawnSync(npm, ['audit', '--omit=dev', '--audit-level=moderate', '--ignore-scripts'], {
  env: environment,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.error) throw result.error;
if (result.status === null) {
  console.error(`npm audit terminated by signal ${result.signal ?? 'unknown'}`);
  process.exit(1);
}
process.exit(result.status);
