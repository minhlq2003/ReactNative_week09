import { useState, useEffect, useReducer } from "react";
import { FlatList, SafeAreaView, View , Text, TouchableOpacity, TextInput, ActivityIndicator} from "react-native";
import { Checkbox } from "react-native-paper";


function App() {
    const [task, setTask] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editStates, setEditStates] = useState({});
    const [state, dispatch] = useReducer(reducer, {data: []});

    function reducer(state, action) {
      switch (action.type){
        case 'SET': return {...state, data: action.todolist}
        case 'DELETE': return {...state}
        default: return {...state}
      }
    }

    const handleCheckTask = async (id, isFinished) => {
        setLoading(true);
        try {
            const response = await fetch(`https://670b380aac6860a6c2cb6db9.mockapi.io/todoapi/job/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    isFinished: !isFinished
                })
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log('Task updated:', data);
            fetchTask();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }
    const handleDeleteTask = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`https://670b380aac6860a6c2cb6db9.mockapi.io/todoapi/job/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            console.log('Task deleted:', id);
            fetchTask();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }
    
    const handleEditTask = async (id, title) => {
        try {
            const response = await fetch(`https://670b380aac6860a6c2cb6db9.mockapi.io/todoapi/job/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title
                })
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log('Task updated:', data);
            fetchTask();
        } catch (error) {
            console.error('Error updating task:', error);
        }
        toggleEditState(id);
    }
    
    

    const toggleEditState = (id) => {
        setEditStates((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));

    };
    
    const Item = ({id, title, isFinished }) => {
        const isEdit = editStates[id] || false;
        const [newTitle, setNewTitle] = useState(title);
        return (
            <View style={{flexDirection: "row", justifyContent:"space-between", padding:5, margin:5, borderRadius:20, backgroundColor: "#ffe"}}>
                <View style={{flexDirection:"row"}}>
                    <Checkbox
                        status={isFinished ? 'checked' : 'unchecked'}
                        onPress={() => {
                           handleCheckTask(id, isFinished);
                        }}
                    />
                    {isEdit ? 
                    (<TextInput
                        onChangeText={setNewTitle}
                        value={newTitle}
                        
                    />)
                    :(<Text style={{paddingTop:10}}>{title}</Text>)}
                </View>
                <View style={{flexDirection: "row", marginTop: 10, paddingRight: 10}}>
                    <TouchableOpacity style={{borderRadius:5, marginRight:10}} onPress={()=>{handleDeleteTask(id)}}>
                        <Text style={{color:"red"}}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{isEdit? handleEditTask(id, newTitle): toggleEditState(id)}}>
                        {isEdit? 
                        (<Text style={{color:"blue"}}>Save</Text>): (<Text style={{color:"blue"}}>Edit</Text>)}
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    
    useEffect(() => {
        fetchTask();
        console.log('TaskList rendered');
    }, []);

    const fetchTask = async () => {
        fetch(`https://670b380aac6860a6c2cb6db9.mockapi.io/todoapi/job`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        }).then((response) => response.json())
        .then((data) => {
            dispatch({type: 'SET', todolist: data});
        });
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    };


    return ( 
        <SafeAreaView style={{margin:10}}>
            <View style={{alignItems:"center", marginBottom: 50}}><Text style={{ fontSize:30}}>TaskList</Text></View>
            {loading ? (<View style={{height:400}}><ActivityIndicator size="large" color="#0000ff" /></View>)
            :(<View style={{height:400}}>
            <FlatList
                data={state.data}
                renderItem={({ item }) => <Item id={item.id} title={item.title} isFinished={item.isFinished} />}
                keyExtractor={item => item.id}
            />
            </View>)
            }
            <View>
                <TouchableOpacity style={{backgroundColor:"blue", width:200, alignSelf: "center", borderRadius:10, height:50, justifyContent:"center", marginTop: 20}} onPress={()=>{
                    navigation.navigate("AddTask", {fetchTask: fetchTask});
                }} >
                    <Text style={{fontSize: 20, color: "white", textAlign: "center"}}>Add Task</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default App;