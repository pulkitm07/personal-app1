const fs = require('fs');
const path = 'src/data/psychology.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const newConcept = {
  name: 'Cognitive Dissonance',
  originator: 'Leon Festinger',
  year: 1957,
  category: 'general',
  definition: 'The mental discomfort experienced by someone who holds two or more contradictory beliefs. Humans naturally strive for internal consistency, so when inconsistency occurs, individuals become psychologically uncomfortable and are motivated to reduce this dissonance by altering a belief or rationalizing the behavior.',
  research: 'In Festinger\'s classic 1959 experiment, participants performed a boring task and were paid either $1 or $20 to tell the next participant the task was enjoyable. Those paid $1 later reported actually liking the task more than those paid $20 to reduce the mental conflict of lying for so little.',
  professional: 'In business, this explains why team members double down on bad decisions after publicly backing them. If a manager heavily champions a software tool that turns out to be terrible, admitting it conflicts with their self-identity as a smart decision-maker. Instead of abandoning the tool, they rationalize its flaws.',
  howToUse: 'Recognize when you are rationalizing a bad situation just to protect your ego. Ask yourself: "If I were forced to take the opposite stance, what evidence would I see?" In marketing, highlight the gap between a customer\'s desired identity and their current behavior to motivate a purchase.',
  related: [
    'Confirmation Bias — seeking information that confirms existing beliefs',
    'Choice-Supportive Bias — retroactively assigning positive attributes to an option one has selected'
  ]
};

data.splice(1, 0, newConcept); 
fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Added Cognitive Dissonance');
