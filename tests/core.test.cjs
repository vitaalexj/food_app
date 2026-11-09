const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const memory = {};
const context = {
 console, Date, Math, JSON, Number, Array, Object, String, Set, Map, Intl, setTimeout, clearTimeout,
 localStorage: {getItem(k){return memory[k] ?? null},setItem(k,v){memory[k]=v}},
 document: {addEventListener(){},getElementById(){return {innerHTML:'',textContent:'',classList:{add(){},remove(){}}}},querySelectorAll(){return []}},
 window: {addEventListener(){},scrollTo(){}}, navigator:{}, location:{protocol:'file:'}, alert(){}, confirm(){return true}
};
vm.createContext(context);
vm.runInContext(fs.readFileSync('app.js','utf8'),context);
const outcome = vm.runInContext(`(()=>{
const days=weekDays();
const structure=days.every(d=>Object.keys(state.plan[d]||{}).length===4);
const recipe=state.plan[days[0]].breakfast;
const before=recipe.id;
const oldNutrition=statsForDay(days[0]).kcal;
swap(days[0],'breakfast');
const swapped=before!==state.plan[days[0]].breakfast.id;
const sum=grocery();
const shoppingValid=sum.length>0&&sum.every(x=>x.grams>0&&x.price>=0);
const calorieValid=oldNutrition>500&&oldNutrition<10000;
state.profile.avoid=['fish'];
generatePlan();
const filtered=days.every(d=>Object.values(state.plan[d]).every(x=>!x||recipeValid(recipeMap[x.id])));
return {structure,swapped,shoppingValid,calorieValid,filtered};
})()`,context);
for(const [name,result] of Object.entries(outcome)) assert.ok(result,name);
console.log('FoodFlow core tests passed',outcome);
