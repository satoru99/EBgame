function get1d(n){
    return [...Array(n)].map(() => 0);
}

function get2d(n){
    return [...Array(n)].map(() => get1d(n));
}

var board = get2d(1);
var i_selected = -1;
var j_selected = -1;
var i_last = -1;
var j_last = -1;
var e_score = 0;
var b_score = 0;
var n_open = -1;

function offset_add(m, i, j, x){
    let n = m.length;
    if (i < 0 || i > n - 1 || j < 0 || j > n - 1) return;
    m[i][j] += x;
}

function compute_emode(board, m){
    let n = board.length;
    for (let i = 0; i < n; i++){
        for (let j = 0; j < n; j++){
            let z = board[i][j];
            let i2 = i * 2 + 1;
            let j2 = j * 2 + 1;
            switch(z){
            case 1:
                offset_add(m, i2-1, j2, 1);
                offset_add(m, i2+1, j2, 1);
                offset_add(m, i2, j2-1, -1);
                offset_add(m, i2, j2+1, -1);
                offset_add(m, i2-2, j2, 1);
                offset_add(m, i2+2, j2, 1);
                offset_add(m, i2, j2-2, -1);
                offset_add(m, i2, j2+2, -1);
                offset_add(m, i2-2, j2-1, 1/2);
                offset_add(m, i2+2, j2+1, 1/2);
                offset_add(m, i2-2, j2+1, 1/2);
                offset_add(m, i2+2, j2-1, 1/2);
                offset_add(m, i2-1, j2-2, -1/2);
                offset_add(m, i2+1, j2+2, -1/2);
                offset_add(m, i2-1, j2+2, -1/2);
                offset_add(m, i2+1, j2-2, -1/2);
                break;
            case 3:
                offset_add(m, i2-1, j2, -1);
                offset_add(m, i2+1, j2, -1);
                offset_add(m, i2, j2-1, 1);
                offset_add(m, i2, j2+1, 1);
                offset_add(m, i2-2, j2, -1);
                offset_add(m, i2+2, j2, -1);
                offset_add(m, i2, j2-2, 1);
                offset_add(m, i2, j2+2, 1);
                offset_add(m, i2-2, j2-1, -1/2);
                offset_add(m, i2+2, j2+1, -1/2);
                offset_add(m, i2-2, j2+1, -1/2);
                offset_add(m, i2+2, j2-1, -1/2);
                offset_add(m, i2-1, j2-2, 1/2);
                offset_add(m, i2+1, j2+2, 1/2);
                offset_add(m, i2-1, j2+2, 1/2);
                offset_add(m, i2+1, j2-2, 1/2);
                break;
            case 2:
                offset_add(m, i2-1, j2-1, -1);
                offset_add(m, i2+1, j2+1, -1);
                offset_add(m, i2-1, j2+1, 1);
                offset_add(m, i2+1, j2-1, 1);
                offset_add(m, i2-2, j2-2, -1);
                offset_add(m, i2+2, j2+2, -1);
                offset_add(m, i2-2, j2+2, 1);
                offset_add(m, i2+2, j2-2, 1);
                offset_add(m, i2-2, j2-1, -1/2);
                offset_add(m, i2+2, j2+1, -1/2);
                offset_add(m, i2-2, j2+1, 1/2);
                offset_add(m, i2+2, j2-1, 1/2);
                offset_add(m, i2-1, j2-2, -1/2);
                offset_add(m, i2+1, j2+2, -1/2);
                offset_add(m, i2-1, j2+2, 1/2);
                offset_add(m, i2+1, j2-2, 1/2);
                break;
            case 4:
                offset_add(m, i2-1, j2-1, 1);
                offset_add(m, i2+1, j2+1, 1);
                offset_add(m, i2-1, j2+1, -1);
                offset_add(m, i2+1, j2-1, -1);
                offset_add(m, i2-2, j2-2, 1);
                offset_add(m, i2+2, j2+2, 1);
                offset_add(m, i2-2, j2+2, -1);
                offset_add(m, i2+2, j2-2, -1);
                offset_add(m, i2-2, j2-1, 1/2);
                offset_add(m, i2+2, j2+1, 1/2);
                offset_add(m, i2-2, j2+1, -1/2);
                offset_add(m, i2+2, j2-1, -1/2);
                offset_add(m, i2-1, j2-2, 1/2);
                offset_add(m, i2+1, j2+2, 1/2);
                offset_add(m, i2-1, j2+2, -1/2);
                offset_add(m, i2+1, j2-2, -1/2);
                break;
            }
        }
    }
}

function compute_bmode(board, m){
    let n = board.length;
    for (let i = 0; i < n; i++){
        for (let j = 0; j < n; j++){
            z = board[i][j];
            let i2 = i * 2 + 1;
            let j2 = j * 2 + 1;
            switch(z){
            case 2:
                offset_add(m, i2-1, j2, 1);
                offset_add(m, i2+1, j2, 1);
                offset_add(m, i2, j2-1, -1);
                offset_add(m, i2, j2+1, -1);
                offset_add(m, i2-2, j2, 1);
                offset_add(m, i2+2, j2, 1);
                offset_add(m, i2, j2-2, -1);
                offset_add(m, i2, j2+2, -1);
                offset_add(m, i2-2, j2-1, 1/2);
                offset_add(m, i2+2, j2+1, 1/2);
                offset_add(m, i2-2, j2+1, 1/2);
                offset_add(m, i2+2, j2-1, 1/2);
                offset_add(m, i2-1, j2-2, -1/2);
                offset_add(m, i2+1, j2+2, -1/2);
                offset_add(m, i2-1, j2+2, -1/2);
                offset_add(m, i2+1, j2-2, -1/2);
                break;
            case 4:
                offset_add(m, i2-1, j2, -1);
                offset_add(m, i2+1, j2, -1);
                offset_add(m, i2, j2-1, 1);
                offset_add(m, i2, j2+1, 1);
                offset_add(m, i2-2, j2, -1);
                offset_add(m, i2+2, j2, -1);
                offset_add(m, i2, j2-2, 1);
                offset_add(m, i2, j2+2, 1);
                offset_add(m, i2-2, j2-1, -1/2);
                offset_add(m, i2+2, j2+1, -1/2);
                offset_add(m, i2-2, j2+1, -1/2);
                offset_add(m, i2+2, j2-1, -1/2);
                offset_add(m, i2-1, j2-2, 1/2);
                offset_add(m, i2+1, j2+2, 1/2);
                offset_add(m, i2-1, j2+2, 1/2);
                offset_add(m, i2+1, j2-2, 1/2);
                break;
            case 3:
                offset_add(m, i2-1, j2-1, -1);
                offset_add(m, i2+1, j2+1, -1);
                offset_add(m, i2-1, j2+1, 1);
                offset_add(m, i2+1, j2-1, 1);
                offset_add(m, i2-2, j2-2, -1);
                offset_add(m, i2+2, j2+2, -1);
                offset_add(m, i2-2, j2+2, 1);
                offset_add(m, i2+2, j2-2, 1);
                offset_add(m, i2-2, j2-1, -1/2);
                offset_add(m, i2+2, j2+1, -1/2);
                offset_add(m, i2-2, j2+1, 1/2);
                offset_add(m, i2+2, j2-1, 1/2);
                offset_add(m, i2-1, j2-2, -1/2);
                offset_add(m, i2+1, j2+2, -1/2);
                offset_add(m, i2-1, j2+2, 1/2);
                offset_add(m, i2+1, j2-2, 1/2);
                break;
            case 1:
                offset_add(m, i2-1, j2-1, 1);
                offset_add(m, i2+1, j2+1, 1);
                offset_add(m, i2-1, j2+1, -1);
                offset_add(m, i2+1, j2-1, -1);
                offset_add(m, i2-2, j2-2, 1);
                offset_add(m, i2+2, j2+2, 1);
                offset_add(m, i2-2, j2+2, -1);
                offset_add(m, i2+2, j2-2, -1);
                offset_add(m, i2-2, j2-1, 1/2);
                offset_add(m, i2+2, j2+1, 1/2);
                offset_add(m, i2-2, j2+1, -1/2);
                offset_add(m, i2+2, j2-1, -1/2);
                offset_add(m, i2-1, j2-2, 1/2);
                offset_add(m, i2+1, j2+2, 1/2);
                offset_add(m, i2-1, j2+2, -1/2);
                offset_add(m, i2+1, j2-2, -1/2);
                break;
            }
        }
    }
}

function to_color1(x, xmax){
    if (x > 0){
        return to_color2(x, 0, xmax);
    } else {
        return to_color2(0, -x, xmax);
    }
}

function to_color2(x, y, xmax){
    let r = x / xmax;
    let g = (x + y) / xmax * 0.5;
    let b = y / xmax;
    r = 1 - Math.min(Math.max(r, 0), 1);
    g = 1 - Math.min(Math.max(g, 0), 1);
    b = 1 - Math.min(Math.max(b, 0), 1);

    let color = '#';
    color += Math.floor(r * 255).toString(16).padStart(2, '0');
    color += Math.floor(g * 255).toString(16).padStart(2, '0');
    color += Math.floor(b * 255).toString(16).padStart(2, '0');
    return color
}

function print_background(board){
    const zmax = Math.log(65);
    let str = "";
    let plot_data = document.getElementById("plot_data").value;
    let n = board.length;
    let emode = get2d(n*2+1);
    let bmode = get2d(n*2+1);
    compute_emode(board, emode);
    compute_bmode(board, bmode);
    e_score = 0;
    b_score = 0;
    for (let i=0; i < n * 2 + 1; i++){
        for (let j=0; j < n * 2 + 1; j++){
            let ze = emode[i][j];
            let zb = bmode[i][j];
            let x = j / 2 - 0.25;
            let y = i / 2 - 0.25;
            let color = ''
            switch(plot_data){
            case "E&B Power":
                color = to_color2(Math.log(zb * zb + 1), Math.log(ze * ze + 1), zmax);
                break;
            case "E-mode Amp":
                color = to_color1(ze, 8.);
                break;
            case "B-mode Amp":
                color = to_color1(zb, 8.);
                break;
            default:
                color = "white";
                break;
            }
            str += `<rect x="${x}" y="${y}" width="0.5" height="0.5" fill="${color}"/>`;
            e_score += ze * ze;
            b_score += zb * zb;
        }
    }
    if (plot_data == "None") return "";
    return str;
}

function print_selected(){
    let str = "";
    if (i_selected == -1 || j_selected == -1){
        return str;
    }
    str += `<rect x="${j_selected}" y="${i_selected}" width="1" height="1" stroke="black" stroke-width="0.01" fill="white"/>`;
    for (let i = 0; i < 3; i++){
        for (let j = 0; j < 3; j++){
            x = j_selected + j / 3.;
            y = i_selected + i / 3.;
            x0 = x + 1. / 6.;
            y0 = y + 1. / 6.;
            if (i == 1 && j == 1){
                str += "";
                z = 0;
            } else if (i == 1) {
                x1 = x0 + 0.5/3;x2 = x0 - 0.5/3; y1 = y0; y2 = y0;
                str += `<line class="st1" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
                z = 1;
            } else if (j == 1){
                x1 = x0;x2 = x0; y1 = y0 + 0.5/3.; y2 = y0 - 0.5/3.;
                str += `<line class="st1" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
                z = 3;
            } else if ((i-1) * (j-1) == 1){
                x1 = x0 + 0.35/3;x2 = x0 - 0.35/3; y1 = y0 + 0.35/3; y2 = y0 - 0.35/3;
                str += `<line class="st1" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
                z = 2;
            } else {
                x1 = x0 - 0.35/3;x2 = x0 + 0.35/3; y1 = y0 + 0.35/3; y2 = y0 - 0.35/3;
                str += `<line class="st1" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
                z = 4;
            }
            str += `<rect x="${x}" y="${y}" width="0.3333" height="0.3333" fill="transparent" onclick="on_click_select(${i_selected},${j_selected}, ${z});"/>`

        }
    }
    return str;
}

function print_table(){
    const ul = 100;
    let n = board.length;
    let width = ul * n;
    str = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${width}" viewBox="-0.015 -0.015 ${n + 0.03} ${n + 0.03}">`;
    str += `<rect x="0" y="0" width="${n}" height="${n}" fill="#FFFFFF"/>`;
    str += print_background(board);
    for (let i=0; i < n; i++){
        for (let j=0; j < n; j++){
            x0 = j + 0.5;
            y0 = i + 0.5;
            z = board[i][j];
            switch(z){
            case 1:
                x1 = x0 + 0.5;x2 = x0 - 0.5; y1 = y0; y2 = y0;
                break;
            case 2:
                x1 = x0 + 0.35;x2 = x0 - 0.35; y1 = y0 + 0.35; y2 = y0 - 0.35;
                break;
            case 3:
                x1 = x0;x2 = x0; y1 = y0 + 0.5; y2 = y0 - 0.5;
                break;
            case 4:
                x1 = x0 - 0.35;x2 = x0 + 0.35; y1 = y0 + 0.35; y2 = y0 - 0.35;
                break;
            default:
                continue;
            }
            let color = "black";
            if (i == i_last && j == j_last) color = (n_open % 2 == 0) ? "blue" : "green";
            str += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="0.05"/>`;
        }
    }
    for (let i=0; i < n; i++){
        for (let j=0; j < n; j++){
            str += `<rect x="${j}" y="${i}" width="1" height="1" fill="transparent" stroke="black" stroke-width="0.01" onclick="on_click_cell(${i},${j});" />`
        }
    }
    str += print_selected();
    str += "</svg>"
    let target = document.getElementById("board");
    target.innerHTML = "";
    target.innerHTML += str;
    print_score();
}

function print_score(){
    let e_str = `E-mode score: ${e_score}`;
    let b_str = `B-mode score: ${b_score}`;
    if (n_open == 0){
        if (e_score > b_score) {
            e_str += " <b>Win!</b>";
        } else if (e_score < b_score) {
            b_str += " <b>Win!</b>";
        } else {
            e_str += " Draw";
            b_str += " Draw";
        }
    }
    document.getElementById("e_score").innerHTML = e_str;
    document.getElementById("b_score").innerHTML = b_str;
}

function on_click_start(){
    let n = Number(document.getElementById("board_size").value);
    i_selected = -1;
    j_selected = -1;
    i_last = -1;
    j_last = -1;
    n_open = n * n;
    board = get2d(n);
    print_table();
}

function on_click_cell(i, j){
    if (i_selected == -1 || j_selected == -1){
        i_selected = i;
        j_selected = j;
    } else {
        i_selected = -1;
        j_selected = -1;
    }
    print_table();
}

function on_click_select(i, j, z){
    if (board[i][j] == 0 && z > 0){
        n_open -= 1;
    } else if (board[i][j] > 0 && z == 0){
        n_open += 1;
    }
    board[i][j] = z;
    i_selected = -1;
    j_selected = -1;
    i_last = i;
    j_last = j;
    print_table();
}

function on_click_pc(){
    let n = board.length;
    //let n_open = 0;
    let pc_mode = document.getElementById("pc_mode").value;
    //for (let i=0; i < n; i++){
    //    for (let j=0; j < n; j++){
    //        if (board[i][j] == 0) n_open += 1;
    //    }
    //}
    if (n_open == 0) return;
    n_open -= 1;
    i_selected = -1;
    j_selected = -1;
    switch(pc_mode){
    case "L0 Random":
        pc_random();
        break;
    case "L1 E-mode":
        pc_level1(1);
        break;
    case "L1 B-mode":
        pc_level1(-1);
        break;
    case "L2 E-mode":
        pc_level2(1);
        break;
    case "L2 B-mode":
        pc_level2(-1);
        break;
    }
    print_table();
}

function pc_random(){
    let n = board.length;
    while (true){
        let i = Math.floor(Math.random() * n);
        let j = Math.floor(Math.random() * n);
        if (board[i][j] > 0){
            continue;
        }
        board[i][j] = Math.floor(Math.random() * 4) + 1;
        i_last = i;
        j_last = j;
        break;
    }
}

function pc_level1(eb){
    let n = board.length;
    while (true){
        let i = Math.floor(Math.random() * n);
        let j = Math.floor(Math.random() * n);
        if (board[i][j] > 0) continue;
        let e_score = get1d(4);
        let kmax = 0;
        for (let k=0; k < 4; k++){
            board[i][j] = k + 1;
            let emode = get2d(n*2+1);
            let bmode = get2d(n*2+1);
            compute_emode(board, emode);
            compute_bmode(board, bmode);
            for (let i2=0; i2 < n * 2 + 1; i2++){
                for (let j2=0; j2 < n * 2 + 1; j2++){
                    e_score[k] += eb * emode[i2][j2] * emode[i2][j2]
                    e_score[k] -= eb * bmode[i2][j2] * bmode[i2][j2]
                }
            }
            if (e_score[k] > e_score[kmax]){
                kmax = k;
            }
        }
        board[i][j] = kmax + 1;
        i_last = i;
        j_last = j;
        break;
    }
}

function pc_level2(eb){
    let n = board.length;
    let imax = 0;
    let jmax = 0;
    let kmax = 0;
    let score_max = -9999;

    for (let i=0; i < n; i++){
        for (let j=0; j < n; j++){
            if (board[i][j] > 0) continue;
            for (let k=1; k < 5; k++){
                board[i][j] = k;
                let emode = get2d(n*2+1);
                let bmode = get2d(n*2+1);
                let score = 0;
                compute_emode(board, emode);
                compute_bmode(board, bmode);
                for (let i2=0; i2 < n * 2 + 1; i2++){
                    for (let j2=0; j2 < n * 2 + 1; j2++){
                        score += eb * emode[i2][j2] * emode[i2][j2];
                        score -= eb * bmode[i2][j2] * bmode[i2][j2];
                    }
                }
                if (score > score_max){
                    imax = i;
                    jmax = j;
                    kmax = k;
                    score_max = score;
                } else if (score == score_max){
                    if (Math.random() > 0.5) {
                        imax = i;
                        jmax = j;
                        kmax = k;
                        score_max = score;
                    }
                }
            }
            board[i][j] = 0;
        }
    }
    board[imax][jmax] = kmax;
    i_last = imax;
    j_last = jmax;
}

on_click_start();
