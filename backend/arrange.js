
async function fetch_all_sections(courses){
    let arr1 = []
    for (let i in courses){
        //console.log(courses[i])
        //console.log("http://localhost:4000/classes/search_by_course/".concat(courses[i]));
        let response = await fetch("http://localhost:4000/classes/search_by_course/".concat(courses[i]));
        let arr2 = await response.json();
        arr1 = arr1.concat(arr2);
    }
    return arr1;
}

function table_gen(rows,cols, default_value = null){
    var arr1 = []
    for (let i = 0; i < rows; i++){
        var arr2 = [];
        for (let j = 0; j< cols; j++){
            arr2.push(default_value)
        }
        arr1.push(arr2)
    }
    return arr1
}

function allowed(course, allowed_time){
    for (let i in allowed_time){
        //console.log(allowed_time[i], course.class_days, course.class_time, course.course, i)
        if ((allowed_time[i][0] == course.class_days) && (allowed_time[i][1] == course.class_time)){
            if (course.has_lab){
                for (let j in allowed_time){
                    if ((allowed_time[j][0] == course.lab_days) && (allowed_time[j][1] == course.lab_time)){
                        return true
                    }
                }
            }
            else return true
        }
    }
    return false
    }

function taken_before(course, courses_taken){
    for (let i in courses_taken){
        if (course.course === courses_taken[i]){
            return true
        }
    }
    return false
}

export async function arrange(courses, num_of_courses, allowed_time){
    var arr1 = [];
    var course_taken = [];
    let response = []
    var stack = []
    let table = table_gen(6,6,true)
    arr1 = await fetch_all_sections(courses)
    let i = 0
    while (1){
        //console.log(course_taken)
        if (taken_before(arr1[i],course_taken)){
            //console.log("aaa");
        } 
        else if (!(table[arr1[i].class_days-1][arr1[i].class_time-1])){
            //console.log("bbb");
        }
        else if (arr1[i].has_lab && ((!(table[arr1[i].lab_days-1][arr1[i].lab_time-1])) || (!(table[arr1[i].lab_days-1][arr1[i].lab_time])))){
            //console.log('bbb.ccc')
        }
        else if (!(allowed(arr1[i] , allowed_time))){
            //console.log("ccc");
        }
        else{
            table[arr1[i].class_days-1][arr1[i].class_time-1] = false;

            if (arr1[i].class_days == 1) table[arr1[i].class_days+4][arr1[i].class_time-1] = false;
            else table[arr1[i].class_days+1][arr1[i].class_time-1] = false;

            if (arr1[i].has_lab){
                table[arr1[i].lab_days-1][arr1[i].lab_time-1] = false;
                table[arr1[i].lab_days-1][arr1[i].lab_time] = false;
            }
            course_taken.push(arr1[i].course);
            stack.push(i);
        }
        i+=1;
        
        if (stack.length === num_of_courses) break;

        if (i === arr1.lenght){
            i = stack.pop();
            table[arr1[i].class_days-1][arr1[i].class_time-1] = true;
            i+=1;
        }

        if (i >= arr1.length){
            break
        }
    }
    
    response = stack.map(i => arr1[i]);
    //console.log(response);
    return response
}

// async function main(){

//     const courses = ["a", "b", "c"];
//     const num_of_courses = 3;
//     const allowed_time = [[1, 1],[1 , 2],[2,1]];

//     const ddd = await arrange(courses , num_of_courses, allowed_time)
//     console.log(ddd)
// }

// main();
