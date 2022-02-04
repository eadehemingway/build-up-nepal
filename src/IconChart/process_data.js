
import { data } from "./../data/data";
import { flag_size, COLUMNS, red_blue_padding , red_gap } from "./constants";

const getTotalRows = (data, col_start_index) =>  Math.ceil((data.length + col_start_index)/ COLUMNS);
const getStartIndex = (prev_data) => prev_data.length % COLUMNS;
export const one_off_data = data.filter(d=> d["flag-status"] === "one-off").map(d=>({ flag: d["flag-status"], status: d.Status, id: d["#"] }));
const total_rows_one_off = getTotalRows(one_off_data, 0);
export const blue_red_gap = total_rows_one_off * flag_size + red_blue_padding;

const enterprise_data = data.filter(d=> d["flag-status"] === "enterprise").map(d=> ({ flag: d["flag-status"], status: d.Status, id: d["#"] }));

const running_ent_data = enterprise_data.filter((d)=> d.status === "Running" ).map(d=> ({ ...d, status: "RUNNING" }));
const data_pending_ent_data = enterprise_data.filter((d)=> d.status === "Data pending" ).map(d=> ({ ...d, status: "PENDING" }));

const closed_ent_data = enterprise_data.filter((d)=> d.status === "Closed / Sold" ).map(d=> ({ ...d, status: "CLOSED" }));
const struggling_ent_data = enterprise_data.filter((d)=> d.status === "Struggling" || d.status === "Running, Struggling" ).map(d=> ({ ...d, status: "STRUGGLING" }));

export const order = ["RUNNING", "STRUGGLING", "CLOSED", "PENDING"];
const LOOKUP = {
    RUNNING: running_ent_data,
    STRUGGLING: struggling_ent_data,
    PENDING: data_pending_ent_data,
    CLOSED: closed_ent_data
};
export const ordered_ent_data = order.map(d=> LOOKUP[d]).flat();

function getYRangesPerSection(){
    const rows_per_section = getSectionRows();
    const height_per_section = rows_per_section.map(r=> r * flag_size);
    let prev_height = 0;
    let prev_data = [];
    const y_range_per_section = height_per_section.map((h, i)=>{
        let start_index = 0;
        let red_gap_adjusted = 0;
        if (i > 0){
            start_index = getStartIndex(prev_data);
            red_gap_adjusted = start_index === 0 ? red_gap : red_gap - flag_size;
        }
        prev_data += LOOKUP[order[i]];
        const min_y = prev_height + red_gap_adjusted;
        const max_y = min_y + h;
        prev_height = max_y;
        return [min_y, max_y];
    }).map(arr=> ([arr[0] + blue_red_gap, arr[1] + blue_red_gap]));
    return y_range_per_section;
}


const y_ranges_per_section = getYRangesPerSection();

// get how many rows are in each section (slighty tricky because you need to know what column index you start at)
function getSectionRows(){
    const row_nums = order.map((s, i)=> {
        const data = LOOKUP[s];
        if (i === 0) {
            const rows = getTotalRows(data, 0);
            return rows;
        }else{
            const prev_data = getAccumalativePrevData(i);
            const start_index = getStartIndex(prev_data);
            const rows = getTotalRows(data, start_index);
            return rows;
        }
    });
    return row_nums;
}


function getAccumalativePrevData(i){
    let prev_data= [];
    for(let j = 0; j < i; j ++){
        const data = LOOKUP[order[j]];
        prev_data = [...prev_data, ...data];
    }
    return prev_data;

}
function getFlagIdOfEntFlag(x, y){

    const section_index = y_ranges_per_section.reduce((acc, range, i)=>{
        if (y > range[0] && y < range[1]) return i;
        return acc;
    }, null);

    const status = order[section_index];
    if (section_index=== undefined || section_index === null) return null;
    const min_section_val = y_ranges_per_section[section_index][0];

    const relative_y = y - min_section_val;

    const rows = Math.floor(relative_y/ flag_size);
    const col = Math.floor(x / flag_size);

    const prev_data = getAccumalativePrevData(section_index);// needs to be accumulative
    const start_index = getStartIndex(prev_data, COLUMNS);

    const index = (rows * COLUMNS) + col - start_index;

    const data = LOOKUP[status];

    const highlighted_id = data ? data[index]?.id: null;

    return highlighted_id;

}

export function getFlagId(x, y){
    const row_if_no_gaps = Math.floor(y / flag_size);
    const col = Math.floor(x / flag_size);
    if (col > 7 || col < 0) return null;
    let highlighted_id;

    const is_one_off = row_if_no_gaps < total_rows_one_off;
    if (is_one_off){
        const index = (row_if_no_gaps * COLUMNS) + col;
        highlighted_id = one_off_data[index]?.id;
    }else{
        highlighted_id = getFlagIdOfEntFlag(x, y);
    }
    return highlighted_id || null;
}