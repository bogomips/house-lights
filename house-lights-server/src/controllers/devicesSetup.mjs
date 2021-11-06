import config from '../config.mjs';

const devicesSetup = async (ctx, next) => {
    ctx.body = config.devicesSetup;
};

export default devicesSetup;