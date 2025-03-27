const banner = `
██╗  ██╗██╗   ██╗███╗   ███╗ █████╗     ███╗   ███╗██╗███████╗██████╗ ██╗   ██╗
██║ ██╔╝██║   ██║████╗ ████║██╔══██╗    ████╗ ████║██║██╔════╝██╔══██╗██║   ██║
█████╔╝ ██║   ██║██╔████╔██║███████║    ██╔████╔██║██║█████╗  ██████╔╝██║   ██║
██╔═██╗ ██║   ██║██║╚██╔╝██║██╔══██║    ██║╚██╔╝██║██║██╔══╝  ██╔══██╗██║   ██║
██║  ██╗╚██████╔╝██║ ╚═╝ ██║██║  ██║    ██║ ╚═╝ ██║██║███████╗██║  ██║╚██████╔╝
╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝    ╚═╝     ╚═╝╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ 
`;

console.log('\x1b[36m%s\x1b[0m', banner);
console.log('\x1b[32m%s\x1b[0m', '🚀 Kuma Mieru is starting...');
console.log(
  '\x1b[33m%s\x1b[0m',
  `📡 Environment: NODE_ENV=${process.env.NODE_ENV}, CI_MODE=${process.env.CI_MODE}`,
);
console.log(
  '\x1b[34m%s\x1b[0m',
  `🌐 Uptime Kuma URL: ${process.env.CI_MODE === 'true' ? 'CI Mode' : process.env.UPTIME_KUMA_BASE_URL || 'Not configured'}`,
);
console.log('\x1b[35m%s\x1b[0m', `🔑 Page ID: ${process.env.PAGE_ID || 'Not configured'}`);
console.log('\n');
