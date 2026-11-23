(()=>{
  const english=globalThis.RIDDLE_JOURNEY_EN;
  const russian=globalThis.RIDDLE_JOURNEY_RU;
  const hebrew=globalThis.RIDDLE_JOURNEY_HE;
  if(!english||!russian||!hebrew)throw new Error('A localized riddle question bank did not load.');

  const ages=['6-7','8-9','10-11'];
  const getEnglishActivities=age=>Object.entries(english[`Ages ${age}`]||{});
  const getRussianActivities=age=>{
    const group=russian.ageGroups.find(item=>item.ageGroup.replace(/\D/g,'').includes(age.replace('-','')));
    return (group?.lessons||[]).map(lesson=>[lesson.topic,lesson.questions]);
  };
  const getHebrewActivities=age=>(hebrew[age]||[]).map(activity=>[activity.activityName,activity.questions]);
  const titles={he:{},en:{},ru:{}},levels={};

  for(const age of ages){
    const localized={en:getEnglishActivities(age),ru:getRussianActivities(age),he:getHebrewActivities(age)};
    for(const language of ['he','en','ru']){
      const activities=localized[language];
      if(activities.length!==12)throw new Error(`Expected 12 ${language} riddle activities for age ${age}.`);
      titles[language][age]=activities.map(([title])=>title);
    }
    const activityRows=[];
    for(let activityIndex=0;activityIndex<12;activityIndex++){
      const rowsByLanguage={
        en:localized.en[activityIndex][1],
        he:localized.he[activityIndex][1],
        ru:localized.ru[activityIndex][1]
      };
      if(Object.values(rowsByLanguage).some(rows=>!Array.isArray(rows)||rows.length!==10)){
        throw new Error(`Expected 10 localized riddle questions for age ${age}, activity ${activityIndex+1}.`);
      }
      const questions=[];
      for(let questionIndex=0;questionIndex<10;questionIndex++){
        const rows=Object.fromEntries(['he','en','ru'].map(language=>[language,rowsByLanguage[language][questionIndex]]));
        const q={},a={},choices={};
        for(const language of ['he','en','ru']){
          const row=rows[language];
          const incorrect=row.incorrectOptions||row.wrongOptions||row.wrongAnswers;
          if(typeof row.question!=='string'||typeof row.correctAnswer!=='string'||!Array.isArray(incorrect)||incorrect.length!==3){
            throw new Error(`Invalid ${language} riddle question for age ${age}, activity ${activityIndex+1}, question ${questionIndex+1}.`);
          }
          q[language]=row.question;
          a[language]=row.correctAnswer;
          choices[language]=[row.correctAnswer,...incorrect];
        }
        questions.push({q,a,choices});
      }
      activityRows.push(questions);
    }
    levels[age]=activityRows;
  }
  globalThis.AGE_QUESTION_BANKS=globalThis.AGE_QUESTION_BANKS||{};
  globalThis.AGE_QUESTION_BANKS.riddles={titles,levels};
})();
