import { arrange } from "./arrange.js";

async function main(){

    const courses = ["a", "b", "c"];
    const num_of_courses = 3;
    const allowed_time = [[1, 1],[1 , 2],[2,1]];

    const ddd = await arrange(courses , num_of_courses, allowed_time)
    console.log(ddd)
}

main();