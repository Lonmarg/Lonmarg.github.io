const express = require('express');
const router = express.Router();
const mysql = require('mysql');

let pool = mysql.createPool({
	connectionLimit: 10,
	host: 'classmysql.engr.oregonstate.edu',
	user: 'cs340_wellheup',
	password: 'Akirr@5t@r5und3r',
	database: 'cs340_wellheup'
});

router.get('/', function(req, res, next) {
    let context = {};
	
	let sergeantsList = "SELECT * FROM sergeants";
	
	pool.query(sergeantsList, function(err, q_sergeants_list)
	{
		if(err)
		{
			next(err);
			return;
		}
		
		context.sergeantsList = q_sergeants_list;
		
		let weapons = "SELECT equipments.id, equipments.name, equipments.is_special_weapon FROM equipments";
				
		pool.query(weapons, function(err, q_possible_equipments)
		{
			if(err)
			{
				next(err);
				return;
			}
			
			context.possible_equipments = q_possible_equipments;
		
			//Get all sergeants equipments that aren't special weapons
			let sql = "SELECT equipments.name FROM sergeants_equipments" + 
					   " INNER JOIN sergeants ON (sergeants_equipments.sergeantid = sergeants.id )" + 
					   " INNER JOIN equipments ON (sergeants_equipments.equipmentid = equipments.id )" + 
					   " WHERE sergeants_equipments.sergeantid = (?) AND equipments.is_special_weapon = 0";
			
			sergeantsLoaded = 0;
			
			for(let i=0; i< context.sergeantsList.length; i++)
			{
				pool.query(sql, [context.sergeantsList[i].id], function(err, q_sergeants_equipments)
				{
					if(err)
					{
						next(err);
						return;
					}
					
					//If he has no weapons, set this to false so we can display None
					if(q_sergeants_equipments.length == 0)
					{
						context.sergeantsList[i].hasEquipment = false;
					}
					else if(q_sergeants_equipments.length == 1)
					{
						context.sergeantsList[i].hasEquipment = true;
						context.sergeantsList[i].sergeants_equipments = q_sergeants_equipments;
						context.sergeantsList[i].onlyOne = true;
					}
					else
					{
						context.sergeantsList[i].hasEquipment = true;
						context.sergeantsList[i].sergeants_equipments = q_sergeants_equipments;
						context.sergeantsList[i].onlyOne = false;
					}
					
					//Get all sergeants equipments that aren't special weapons
					let sql = "SELECT equipments.id, equipments.name FROM sergeants_equipments" + 
							  " INNER JOIN sergeants ON (sergeants_equipments.sergeantid = sergeants.id )" + 
							  " INNER JOIN equipments ON (sergeants_equipments.equipmentid = equipments.id )" + 
							  " WHERE sergeants_equipments.sergeantid = (?) AND equipments.is_special_weapon = 1";

					pool.query(sql, [context.sergeantsList[i].id], function(err, q_sergeants_special_equipments)
					{
						if(err)
						{
							next(err);
							return;
						}
						
						context.sergeantsList[i].special_equipments = q_sergeants_special_equipments;
				
						sergeantsLoaded += 1;
						
						if(sergeantsLoaded >= context.sergeantsList.length)
						{
							finishedLoading(res, context);
						}
					});
				});
			}
		});
    });
});

function finishedLoading(res, context)
{
	res.render('sergeants', context);
}

router.delete('/:id', function(req, res) {
	//Figure out how to deal with dependencies where we delete an item that is currently being used
	
	// var sql = "DELETE FROM equipments WHERE id = ?";
	// var inserts = [req.params.id];
	// sql = pool.query(sql, inserts, function(error, results, fields) {
		// if(error) {
			// console.log(error)
			// res.write(JSON.stringify(error));
			// res.status(400);
			// res.end();
		// } else {
			// res.status(202).end();
		// }
	// })
})

router.post('/add', function(req, res) {
	// var sql = "INSERT INTO equipments (name, is_sergeant_weapon, is_special_weapon, point_cost) VALUES (?, ?, ?, ?)";

	// var inserts = [req.body.name, req.body.sergWeapon, req.body.specEquip, req.body.cost ];
	
	// sql = pool.query(sql, inserts, function(error, results, fields) {
		// if(error) {
			// console.log(error)
			// res.write(json.stringify(error));
			// res.status(400);
			// res.end();
		// } else {
			// res.status(202).end();
		// }
	// })
})

module.exports = router;