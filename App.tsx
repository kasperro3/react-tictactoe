import { Text, View, StyleSheet, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { useState } from "react";

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <Game/>
    </View>
  );
}

function Game(){
  // state of the game
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xTurn = currentMove % 2 == 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: string[])
  {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpToMove(nextMove: number)
  {
    setCurrentMove(nextMove);
  }

  // list possible moves
  const moves = history.map((squares, move) => {
    let moveDescription;
    if (move > 0) {
      moveDescription = `Go to move ${move}`;
    } else {
      moveDescription = "Restart";
    }

    return (
      <TouchableOpacity key={move} style={styles.historyItem} onPress = {() => jumpToMove(move)}>
        <Text>{moveDescription}</Text>
      </TouchableOpacity>
    );
  });

  return (
    <View style={{flex : 1}}>
      <Board xTurn = {xTurn} squares = {currentSquares} onPlay={handlePlay}/>
      <ScrollView contentContainerStyle={styles.historyContainer}>
          {moves}
      </ScrollView>
    </View>
  )
} 

function Board ({xTurn, squares, onPlay}: {xTurn: boolean, squares: string[], onPlay: (s: string[]) => void}){
  function handlePress(index: number) {
    // check if clicked square is occupied
    if(squares[index] || calculateWinner({squares}))
      return;

    const newSquares = squares.slice();

    // set clicked square to current player's
    if(xTurn)
      newSquares[index] = "X";
    else
      newSquares[index] = "O";

    // updates
    onPlay(newSquares);
  }

  let stats;
  if(calculateWinner({squares}))
    // winner is last player
    stats = `Winner is ${!xTurn ? 'X' : 'O'}`;
  else
    stats = `Next player: ${xTurn ? 'X' : 'O'}`;

  // create rows to render
  function BoardRow({i}: {i : number}){
    const row = [i*3, i*3+1, i*3+2].map(index => (
      <Square key={index} value = {squares[index]} index={index} onSquareClick={handlePress}/>
    ));
    return(
      <View style={styles.boardRow}>
        {row}
      </View>
    );
  }

  return (
    <View style = {styles.board}>
      <Text>{stats}</Text>
      <BoardRow i={0}/>
      <BoardRow i={1}/>
      <BoardRow i={2}/>
    </View>
  );
}

function Square({value, index, onSquareClick}: {value: string, index: number, onSquareClick: (num: number) => void}) {
  return (
    <TouchableOpacity style={styles.square} onPress={() => onSquareClick(index)}>
      <Text style={{fontSize : 80}}>{value}</Text>
    </TouchableOpacity>
  );
}

function calculateWinner({squares}: {squares: string[]})
{
  const lines = [
    // horizontals
    [0,1,2],
    [3,4,5],
    [6,7,8],
    // verticals
    [0,3,6],
    [1,4,7],
    [2,5,8],
    // diagonals
    [0,4,8],
    [6,4,2]
  ];

  for(let i = 0; i < lines.length; i++)
  {
    const [a,b,c] = lines[i];
    // ensure that any of the squares is not null and check for winner
    if(squares[a] && squares[a] == squares[b] && squares[a] == squares[c])
      return true;
  }
  return null;
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    marginTop : 120,
    marginBottom : 20,
    alignContent: 'center',
    justifyContent :'center',
  },
  board : {
    flexWrap : 'wrap',
    flexDirection : 'column',
    alignItems : 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  boardRow : {
    flexWrap : 'wrap', 
    flexDirection : 'row',
  },
  square : {
    width : 120,
    height : 120,
    borderWidth : 1,
    borderColor : 'black',
    justifyContent : 'center',
    alignItems: 'center',
  },
  historyContainer : {
    alignItems : 'center',
    paddingVertical : 20,
    paddingHorizontal : 20
  },
  historyItem : {
    borderWidth : 1,
    padding : 10,
    width: 110,
    alignItems: 'center'
  }
});
