import webpush from 'web-push';

import { envs } from './envs';

webpush.setVapidDetails(
	`mailto:${envs.MAILER_EMAIL}`,
	envs.PUBLIC_VAPID_KEY,
	envs.PRIVATE_VAPID_KEY,
);

export { webpush };
