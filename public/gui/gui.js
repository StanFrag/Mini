var optionScreenJSON = {
	id: 'optionScreen',
	component: 'Window',	
	padding: 0,
	position: { x: 0, y: 0 },
	width: '100%',
	height: 640,

	layout: [1, 16],
	children: [
		{
		    text: 'My Awesome App Screen 1',
		    font: {
		        size: '20px',
		        family: 'Skranji',
		        color: '#fff'
		    },
		    component: 'Header',
		    
		    position: 'center',
		  
		    width: 400,
		    height: 60
		},
	{
	    component: 'Layout',

	    z: 1, //the Z index allow to bring the navigation to the top so it can receive events (this is a workaround to the way PIXI handles events)

	    padding: 3,
	    position: { x: 0, y: 0 },
	    width: 400,
	    height: 60,
	    layout: [3, 1],
	    children: [
			null,
			{ id: 'btNext1', text: 'Next', component: 'Button', position: 'center', width: 100, height: 40 },
			null
	    ]
	},
        //force height to occupy all remaining space
	{
        id:'list1',
	    component: 'List',
	    padding: 3,
	    position: { x: 0, y: 20 },
	    width: 400,
	    height: 500,
	    layout: [null, 5],
	    children: [
			{ text: 'list item 1', component: 'Button', skin: 'hListItem', position: 'center', width: 400, height: 100 },
			{ text: 'list item 2', component: 'Button', skin: 'hListItem', position: 'center', width: 400, height: 100 },
			{ text: 'list item 3', component: 'Button', skin: 'hListItem', position: 'center', width: 400, height: 100 },
			{ text: 'list item 4', component: 'Button', skin: 'hListItem', position: 'center', width: 400, height: 100 },
			{ text: 'list item 5', component: 'Button', skin: 'hListItem', position: 'center', width: 400, height: 100 },
			{ text: 'list item 6', component: 'Button', skin: 'hListItem', position: 'center', width: 400, height: 100 },
			{ text: 'list item 7', component: 'Button', skin: 'hListItem', position: 'center', width: 400, height: 100 },
			{ text: 'list item 8', component: 'Button', skin: 'hListItem', position: 'center', width: 400, height: 100 },
			{ text: 'list item 9', component: 'Button', skin: 'hListItem', position: 'center', width: 400, height: 100 },
			{ text: 'list item 10', component: 'Button', skin: 'hListItem', position: 'center', width: 400, height: 100 },
	    ]
	},

        //Fill intermediate children spaces with nulls
        null, null, null, null, null, null,
        null, null, null, null, null, null, 
		{
		    text: 'App footer : vertical slide',
		    font: {
		        size: '20px',
		        family: 'Arial',
		        color: '#fff'
		    },
		    component: 'Header',

		    position: 'center',

		    width: 400,
		    height: 40
		}
	]
}


var guiObj = {
    id: 'myWindow',
    component: 'Window',
    padding: 4,
    //component position relative to parent
    position: { x: 10, y: 10 },
    width: 500,
    height: 500,
    layout:[1,3],
    children: [
     null,
      {
          id: 'myInput',
          text: '',
          component: 'Input',
          position: 'center',
          width: 300,
          height: 50,
      },
      {
          id: 'btn1',
          text: 'Get Text Value',
          component: 'Button',
          position: 'center',
          width: 200,
          height: 100,
      }
    ]
}

var guiConstruction = {
    id: 'main',
    component: 'Window',
    header: { id: 'ttl', skin: 'metalworks', position: { x: 0, y: 0 }, height: 40, text: 'Construction Panel' },
    padding: 4,
    position: { x: 0, y: 0 },
    width: 300,
    height: 170,
    layout: [1, 3],
    children: [
	    {
	        id: 'hlist1',
	        component: 'List',
	        position: 'center',
	        width: 400,
	        height: 160,
	        layout: [4, null],
	        children: []
	    },
    ]
}

