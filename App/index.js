// Filename: index.js
// Combined code from all files

import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Dimensions, Button, TouchableOpacity } from 'react-native';

// App.js code starts
import SnakeGame from './index.js';

export default function App() {
    return (
        <SafeAreaView style={appStyles.container}>
            <Text style={appStyles.title}>Snake Game</Text>
            <SnakeGame />
        </SafeAreaView>
    );
}

const appStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 15,
    },
});

// SnakeGame.js code starts
import React, { useEffect, useState, useRef } from 'react';

const { width, height } = Dimensions.get('screen');
const CELL_SIZE = 20;
const BOARD_WIDTH = Math.floor(width / CELL_SIZE) * CELL_SIZE;
const BOARD_HEIGHT = Math.floor(height / CELL_SIZE) * CELL_SIZE;

const initialSnake = [
    { x: 4, y: 4 },
    { x: 3, y: 4 },
    { x: 2, y: 4 },
];

const getRandomPosition = () => ({
    x: Math.floor(Math.random() * (BOARD_WIDTH / CELL_SIZE)),
    y: Math.floor(Math.random() * (BOARD_HEIGHT / CELL_SIZE)),
});

const SnakeGame = () => {
    const [snake, setSnake] = useState(initialSnake);
    const [food, setFood] = useState(getRandomPosition);
    const [direction, setDirection] = useState({ x: 1, y: 0 });
    const [isGameOver, setIsGameOver] = useState(false);
    const intervalRef = useRef(null);

    const moveSnake = () => {
        setSnake(prev => {
            const newHead = {
                x: prev[0].x + direction.x,
                y: prev[0].y + direction.y,
            };

            if (newHead.x === food.x && newHead.y === food.y) {
                setFood(getRandomPosition);
                return [newHead, ...prev];
            }

            const newSnake = [newHead, ...prev.slice(0, -1)];

            if (newHead.x < 0 || newHead.x >= BOARD_WIDTH / CELL_SIZE || newHead.y < 0 || newHead.y >= BOARD_HEIGHT / CELL_SIZE) {
                setIsGameOver(true);
                clearInterval(intervalRef.current);
                return prev;
            }

            for (let segment of prev) {
                if (segment.x === newHead.x && segment.y === newHead.y) {
                    setIsGameOver(true);
                    clearInterval(intervalRef.current);
                    return prev;
                }
            }

            return newSnake;
        });
    };

    useEffect(() => {
        if (!isGameOver) {
            intervalRef.current = setInterval(moveSnake, 200);
            return () => clearInterval(intervalRef.current);
        }
    }, [direction, isGameOver]);

    const handleDirectionChange = (newDirection) => {
        setDirection(newDirection);
    };

    const resetGame = () => {
        setSnake(initialSnake);
        setFood(getRandomPosition);
        setDirection({ x: 1, y: 0 });
        setIsGameOver(false);
        intervalRef.current = setInterval(moveSnake, 200);
    };

    return (
        <View style={snakeStyles.container}>
            {isGameOver && <Text style={snakeStyles.gameOverText}>Game Over! Press restart.</Text>}
            
            <View style={snakeStyles.board}>
                {snake.map((segment, index) => (
                    <View
                        key={index}
                        style={[
                            snakeStyles.snakeSegment,
                            { left: segment.x * CELL_SIZE, top: segment.y * CELL_SIZE },
                        ]}
                    />
                ))}
                <View
                    style={[
                        snakeStyles.food,
                        { left: food.x * CELL_SIZE, top: food.y * CELL_SIZE },
                    ]}
                />
            </View>
            
            {isGameOver ? (
                <Button title="Restart Game" onPress={resetGame} />
            ) : (
                <View style={snakeStyles.controls}>
                    <TouchableOpacity onPress={() => handleDirectionChange({ x: 0, y: -1 })} style={snakeStyles.controlButton}>
                        <Text>Up</Text>
                    </TouchableOpacity>
                    <View style={snakeStyles.rowControls}>
                        <TouchableOpacity onPress={() => handleDirectionChange({ x: -1, y: 0 })} style={snakeStyles.controlButton}>
                            <Text>Left</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDirectionChange({ x: 1, y: 0 })} style={snakeStyles.controlButton}>
                            <Text>Right</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => handleDirectionChange({ x: 0, y: 1 })} style={snakeStyles.controlButton}>
                        <Text>Down</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const snakeStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    board: {
        width: BOARD_WIDTH,
        height: BOARD_HEIGHT,
        backgroundColor: '#EAEAEA',
        alignSelf: 'center',
        position: 'relative',
    },
    snakeSegment: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: 'green',
        position: 'absolute',
    },
    food: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: 'red',
        position: 'absolute',
    },
    controls: {
        marginTop: 20,
        alignItems: 'center',
    },
    rowControls: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    controlButton: {
        width: 60,
        height: 60,
        backgroundColor: '#DDDDDD',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        borderRadius: 30,
    },
    gameOverText: {
        textAlign: 'center',
        fontSize: 24,
        color: 'red',
        marginVertical: 20,
    },
});

export default SnakeGame;