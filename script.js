


const player = function(name, symbol, score){
    
    function changename(name){
        this.name = name;
    }
    function incrementscore(){
        score = score + 1;
    }
    function resetscore(){
        score = 0;
    }
    function checkscore(){
        return score;
    }
   
    return {name, changename, incrementscore, resetscore, checkscore};  
    
    
};



const gameboard = (function(){


    let board = [0,0,0,0,0,0,0,0,0];
    const td = document.querySelectorAll('td');
    let totalmoves = 0;
    let disable = false;
    const scoreboard = document.getElementById('game-status');
    const dp = document.getElementById('displaywinner');
    const ref = document.getElementsByClassName('refresh');
    

    function configuration(){



        td.forEach(event =>{

            event.addEventListener('click', ()=>{
                let v = event.id -1;
                let k = 'x';
                let p = 1;
                
                if(totalmoves % 2 != 0){
                    k = 'o';
                    p = -1;
                    
                }
               
                if(board[v] == 0 && !disable){
                    board[v] = p;
                    
                    td[v].textContent = k;
                    td[v].style.opacity = 1;
                    totalmoves = totalmoves + 1;
                    let w = displayController.checkwin(board, totalmoves, true);
                    if(w!=-1){displaywinner(w)}
                    else{
                        if(displayController.checkai()){
                            
                            if(displayController.checkmode() == 2){
                                normalmode();
                            }else{
                                hardmode();
                            }
                            totalmoves = totalmoves+1;
                            w = displayController.checkwin(board,totalmoves, true);
                            if(w!=-1){displaywinner(w)};
                        }
                        
                    }

                }

            })
        })
    }
    function normalmode(){
        
        let s = [];
        for(let i = 0 ; i < board.length; i++){
            if(board[i] == 0){
                s.push(i);
            }
        }
        let v = Math.floor(Math.random()*s.length);
    
        board[s[v]]=-1;
        td[s[v]].style.opacity = 1;
        td[s[v]].textContent = 'o';
    }

    function hardmode(){

        let bestval = -1000;
        let x = -1;
        for(let i = 0 ; i < board.length; i++){
            if(board[i] == 0){
                let tempb = board;
                tempb[i] = -1;
                let p  = findbestmove(tempb, totalmoves+1, 1);
                if(p > bestval){
                    x = i;
                    bestval = p;
                }
                tempb[i] = 0;
            }
        }

        
        board[x] = -1;
        td[x].style.opacity = 1;
        td[x].textContent = 'o';


    }
    function findbestmove(board, t , player){
        let w = displayController.checkwin(board, t, false);
        if(w != -1){
            if(w == 1){
                return -10;
            }else if(w == 2){
                return 10;
            }
            return w;
        }
        let score; 
       
        if(player == 2){
            score = -1000;
            for(let i = 0 ; i < board.length; i++){
                if(board[i] == 0){
                    let tempb = board;
                    tempb[i] = -1;
                    let p = findbestmove(tempb, t+1, 1);
                    if(p > score){
                        score = p;
                    }
                    tempb[i] = 0;
                }
            }
        }else if(player == 1){
            score = 1000;
            for(let i = 0 ; i < board.length; i++){
                if(board[i] == 0){
                    let tempb = board;
                    tempb[i] = 1;
                    let p = findbestmove(tempb, t+1, 2);
                    if(p < score){
                        score = p;
                    }
                    tempb[i] = 0;
                }
            }
        }
        return score;      
    }


    function displaywinner(status){
        disable = true;
        scoreboard.setAttribute('style', 'display:none!important');
        if(status == 0){
            dp.textContent = "A Tie!"
        }else if(status == 1){
            dp.textContent = "Player 1 Wins!";
        }else if(status == 2){
            dp.textContent = "Player 2 Wins!";
        }
        dp.setAttribute('style', 'display:block');
        ref[0].setAttribute('style','display:inline-block!important');
    }
    function resetboard(){
        totalmoves = 0;
        board = [0,0,0,0,0,0,0,0,0];
        for(let i = 0 ; i < td.length;i++){
            td[i].textContent = "";
            td[i].style.opacity = 0;
            td[i].style.backgroundColor = "transparent";
        }
        disable = false;
       
        scoreboard.setAttribute('style', 'display:block');
        dp.setAttribute('style', "display:none");
        ref[0].setAttribute('style', "display:none!important");

    }

    configuration();
    return {normalmode,resetboard};

})();

const displayController = (function(){

    const disp1 = document.getElementById('display1');
    const disp2 = document.getElementById('display2');
    const formgroup2 = document.getElementById('form-group2');
    const btngroup3 = document.getElementById('btn-group3');
    const buttons = document.querySelectorAll('button');
    
    const inputs = document.getElementsByClassName('input');
    const p1 = document.getElementById('p1name');
    const p2 = document.getElementById('p2name');
    const td = document.querySelectorAll('td');
    const s1 = document.getElementById('tiescore');
    let mode = 2; 
    let ai = false;
    let tiescore = 0;
    let t = false;
    
    
    const player1 = player('P1', 'x', 0);
    const player2 = player('P2', 'o', 0 );

    function configuration(){
        buttons.forEach(button =>{

            button.addEventListener('click', ()=>{

                if(button.id == 6){;
                    settingPlayer();
                    changeStatus(1);
                }else if(button.id == 7){
                    resetname();
                    gameboard.resetboard();
                    t = false;
                    mode = 2;
                    changeColor();
                    changeStatus(0);
                }else if(button.id == 2){
                    changeStatus(3);
                    ai = true;
                    buttons[0].setAttribute('style', 'background-color: #d3d3d3');
                    button.setAttribute('style', "background-color:#7ea4b3");
                }else if(button.id == 1){
                    changeStatus(4);
                    ai = false;
                    button.setAttribute('style', "background-color:#ff9e94");
                    buttons[1].setAttribute('style', "background-color:#d3d3d3");
                }else if(button.id == 3){
                    mode = 2;
                    changeColor();
                }else if(button.id == 5){
                    mode = 3;
                    changeColor();
                }else if(button.id == 8){
                    setscore();
                    gameboard.resetboard();
                    if(!t){
                        gameboard.normalmode();
                    }
                    t = !t;
                }else if(button.id == 9){
                    if(confirm('Are you sure you want to delete score?')){
                        player1.resetscore();
                        player2.resetscore();
                        tiescore = 0;
                        t = false;
                        setscore();
                        gameboard.resetboard();

                    }
                    
                    

                    
                }
                button.blur();
            })

        })
        
        function resetname(){
            for(let i = 0 ; i < inputs.length; i++){

                inputs[i].value = "";
            }
            player1.changename("P1");
            player2.changename("P2");
            player1.resetscore();
            player2.resetscore();
            tiescore = 0;
            setscore();
            ai = false;
            buttons[0].setAttribute('style', "background-color:#ff9e94");
            buttons[1].setAttribute('style', "background-color:#d3d3d3");
            changeStatus(4);

        }

        function changeColor(){
        
            for(let i = 2; i <= 3; i++){
                if(i == mode){
                    buttons[i].setAttribute('style','background-color:#ffbe61;');
                }else{
                    buttons[i].setAttribute('style','background-color:#aec6cf');
                }
                
            }
        }

        function settingPlayer(){
            
            for(let i = 0 ; i < inputs.length; i++){
                if(inputs[i].value.length > 9){
                    inputs[i].value = inputs[i].value.substring(0, 6) +  "...";
                }
            }
            if(inputs[0].value.trim().length != 0){
                player1.changename(inputs[0].value);
            }
            
            if(ai){
                player2.changename("AI");
            }else if(inputs[1].value.trim().length != 0){
                player2.changename(inputs[1].value);
            }
            setscore();
        }
        



    }

    function setscore(){
        p1.innerHTML = player1.name + `<span id="p1score">${player1.checkscore()}</span>`;
        p2.innerHTML = player2.name + `<span id="p2score">${player2.checkscore()}</span>`;
        s1.textContent = `${tiescore}`;
        
    }
    function changeStatus(status){
        if(status == 1){
            disp1.setAttribute('style', "display:none!important");
            disp2.setAttribute('style', "display:block");
        }else if(status == 0){
            disp2.setAttribute('style', "display:none!important");
            disp1.setAttribute('style', "display:block");
        }else if(status == 3){
            formgroup2.setAttribute('style', "display:none!important");
            btngroup3.setAttribute('style', "display:block");
        }else if(status == 4){
            btngroup3.setAttribute('style', "display:none!important");
            formgroup2.setAttribute('style', "display:block")
        }
    }

    function coloring(x,y,z){
        td[x].style.backgroundColor = "yellow";
        td[y].style.backgroundColor = "yellow";
        td[z].style.backgroundColor = "yellow";
    }

    function checkwin(board, numberofmoves, real){


        let w = 0;

        for(let i = 0 ; i < 3 ; i++){
            let v = i*3;
            let s = board[i] + board[3 + i] + board[6+i];
            let sum = board[v] + board[v+1] + board[v+2];
            if(sum == 3 || s == 3){
                if(real){
                    player1.incrementscore();
                   
                    
                    if(sum == 3){
                        coloring(v,v+1,v+2);
                    }else{
                        coloring(i, 3+i,6+i);
                    }

                }
                
                return 1;
            }else if(sum == -3 || s == -3){
                if(real){
                    player2.incrementscore();
                    if(sum == -3){
                        coloring(v,v+1,v+2);
                    }else{
                        coloring(i, 3+i,6+i);
                    }

                }
                
                return 2;
            }
            



        }

        let p = board[0] + board[4] + board[8];
        let q = board[2] + board[4] + board[6];
        if(p == 3 || q == 3){
            if(real){
                player1.incrementscore();
                if(p == 3){
                    coloring(i, 3+i,6+i);
                }else{
                    coloring(2, 4, 6);
                }
            }
            return 1;
        }else if(p == -3 || q == -3){
            if(real){
                player2.incrementscore();
                if(p == -3){
                    coloring(i, 3+i,6+i);
                }else{
                    coloring(2, 4, 6);
                }
            }
            return 2;
        }

       
            

        if(numberofmoves == 9 || (numberofmoves == 8 && t)){
            if(real){
                tiescore = tiescore+1;
            }
            
            return 0;
        }

        return -1;
        
    }



    


    function checkai(){
        return ai;
    }
    function checkmode(){
        return mode;
    }
  



    configuration();
    return {checkmode,checkai, checkwin};
})();

