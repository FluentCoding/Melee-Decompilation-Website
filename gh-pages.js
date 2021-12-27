var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'master',
        repo: 'https://github.com/FluentCoding/Melee-Decompilation-Website.git',
        user: {
            name: 'FluentCoding',
            email: 'zsuckylp@gmail.com'
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)