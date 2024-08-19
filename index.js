const express = require('express')
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser');

const path = require('path')
app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended: true }));

const readFile = (filename) => {
	return new Promise((resolve,reject) => {
		fs.readFile(filename,'utf8',(err,data) =>{
			if (err) {
				console.error(err);
				reject(err);
				return
			}

			const tasks=JSON.parse(data)
			resolve(tasks)
		})
	})
}

const writeFile = (filename,data) => {
	return new Promise ((resolve,reject) => {

	fs.writeFile(filename, data, 'utf-8',err => {
		if (err) {
			console.error(err);
			reject(err);
			return;
		}
		resolve(true)
	});
   })
}

app.get('/',(req, res) => {

	readFile('./tasks.json')
	.then(tasks =>{
		res.render('index',{
			tasks: tasks,
			error: null
		})
		})
	})

	//const tasks=['Study HTML','Study CSS', 'Study JS', 'Study OOP']
	

app.post('/', (req,res) =>{

let error = null
if(req.body.task.trim().length== 0 ){
	error = 'Please insert correrct task data'
	readFile('./task.json')
	.then(tasks => {
		res.render('index', {
			tasks: tasks,
			error: error
		})
	})
} else {
	//get data from file//

	readFile('./tasks')
	.then(tasks => {

		let index
		if(tasks.length=== 0 )
		{
			index = 0
		} else {
			index = tasks[tasks.length-1].id + 1;
		}
		const newTask = {
			"id" : index,
			"task" : req.body.task
		}

		tasks.push(newTask)
		data = JSON.stringify(tasks, null , 2)
		writeFile('tasks.json',data)
		res.redirect('/')
		})
	   }
})
	

app.get('/delete-task/:taskId',(req,res) => {
	let deletedTaskId = parseInt(req.params.taskId)
	readFile('./tasks.json')
	.then(tasks => {
		tasks.forEach((task,index)=> {
			if(task.id === deletedTaskId){
			tasks.splice(index, 1)
		}
	  })
	data = JSON.stringify(tasks, null , 2)
	writeFile('tasks.json',data).then(()=> {
	res.redirect('/')
	})
   })
})

app.get('/delete-tasks',(req,res) => {
	readFile('./tasks.json')
	.then(tasks => {
		tasks = []
		data = JSON.stringify(tasks, null , 2)
		writeFile('tasks.json',data)
	  })
	res.redirect('/')
   })
   app.get('/edit-task/:taskId', (req, res) => {
	const editTaskId = parseInt(req.params.taskId);
	readFile('./tasks.json').then((tasks) => {
	  const taskToEdit = tasks.find((task) => task.id === editTaskId);
	  if (!taskToEdit) {
		res.redirect('/');
	  } else {
		res.render('edit', {
		  task: taskToEdit,
		  error: null,
		});
	  }
	});
  });
  
  app.post('/update-task/:taskId', (req, res) => {
	const updatedTaskId = parseInt(req.params.taskId);
	const updatedTaskText = req.body.updatedTask.trim();
  
	if (updatedTaskText.length === 0) {
	  res.render('edit', {
		task: { id: updatedTaskId, task: updatedTaskText },
		error: 'Please insert correct task data',
	  });
	} else {
	  readFile('./tasks.json').then((tasks) => {
		const taskToEdit = tasks.find((task) => task.id === updatedTaskId);
		if (!taskToEdit) {
		  res.redirect('/');
		} else {
		  taskToEdit.task = updatedTaskText;
		  const data = JSON.stringify(tasks, null, 2);
		  writeFile('tasks.json', data).then(() => {
			res.redirect('/');
		  });
		}
	  });
	}
  });
  app.post('/clear-all', (req, res) => {
	const emptyTasks = [];
	const data = JSON.stringify(emptyTasks, null, 2);
	writeFile('tasks.json', data).then(() => {
	  res.redirect('/');
	});
  });

app.listen(3001,() =>{
	console.log('Example app is started at http://localhost:3001')
})