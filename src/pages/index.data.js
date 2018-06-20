const defaultData = require('./default.data');
const benefits = require('../components/SectionBenefits/SectionBenefits.data');
const social = require('./data/social.data');
const members = require('./data/team.data');
const advisors = require('./data/advisors.data');
const faq = require('../components/SectionFaq/SectionFaq.data');

const data = {
    team: {
        members,
        advisors,
    },
    social,
    logoUrl: '#page-top',
    benefits,
    faq,
};

module.exports = Object.assign({}, defaultData, data);