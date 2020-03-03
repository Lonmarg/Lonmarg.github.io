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
    context.subtitle = "THIS TEXT PROVES HANDLEBARS WORKS";
    
    // FIND ALL ARMYLISTS
    let err;
    pool.query("SELECT * FROM armylists", getArmylists(err, q_armylists, context));
    
    context.stringOfArmylists = JSON.stringify(q_armylists);

    res.render('home', context);
});

function getArmylists (err, q_armylists, context){
    if(err){
        next(err);
        return;
    }
    context.armylists = q_armylists;
    // FIND ALL SQUADS IN EACH ARMYLIST
    context.armylists.forEach(armylist => {
        pool.query("SELECT * FROM armylists_assaultsquads "+
            "INNER JOIN assaultsquads ON (armylists_assaultsquads.assaultsquadid = assaultsquads.id) " +
            "WHERE armylists_assaultsquads.armylistid = 1", getSquads(err, q_assaultsquads, armylist)); //REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION
    })
}

function getSquads(err, q_assaultsquads, armylist){
    if(err){
        next(err);
        return;
    }
    armylist.assaultsquads=q_assaultsquads;
    armylist.assaultsquads.forEach(assaultsquad => {
        // FIND ALL MARINES IN EACH SQUAD
        pool.query("SELECT * FROM assaultsquads_spacemarines "+
            "INNER JOIN spacemarines ON (assaultsquads_spacemarines.spacemarineid = spacemarines.id ) " +
            "WHERE assaultsquads_spacemarines.assaultsquadid = 1", getMarines(err, q_spacemarines, assaultsquad));//REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION
        // FIND SQUAD SERGEANT
        pool.query("SELECT * FROM sergeants WHERE sergeants.assaultsquadid = 1", getSergeants(err, q_sergeants, assaultsquad));//REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION using asaultsquad.id
    })
}

function getMarines(err, q_spacemarines, assaultsquad){
    if(err){
        next(err);
        return;
    }
    assaultsquad.spacemarines=q_spacemarines;
    // FIND ALL WEAPONS FOR EACH MARINE IN SQUAD
    assaultsquad.spacemarines.forEach(spacemarine => {
        pool.query("SELECT * FROM spacemarines_equipments "+
            "INNER JOIN spacemarines ON (spacemarines_equipments.spacemarineid = spacemarines.id ) " +
            "WHERE spacemarines_equipments.spacemarineid = 1", getMarineEquipments(err, q_weapons, spacemarine));//REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION
    })
}

function getSergeants(err, q_sergeants, assaultsquad){
    if(err){
        next(err);
        return;
    }
    assaultsquad.sergeants=q_sergeants;
    // FIND ALL WEAPONS FOR EACH SERGEANT IN SQUAD
    assaultsquad.sergeants.forEach(sergeant => {
        pool.query("SELECT * FROM sergeants_equipments "+
            "INNER JOIN sergeants ON (sergeants_equipments.sergeantid = sergeants.id ) " +
            "INNER JOIN equipments ON (sergeants_equipments.equipmentid = equipments.id) " +
            "WHERE sergeants_equipments.sergeantid = 1 AND equipments.is_special_weapon != 1", getSergeantEquipments(err, q_weapons, sergeant));//REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION
        
        pool.query("SELECT * FROM sergeants_equipments "+
            "INNER JOIN sergeants ON (sergeants_equipments.sergeantid = sergeants.id ) " +
            "INNER JOIN equipments ON (sergeants_equipments.equipmentid = equipments.id) " +
            "WHERE equipments.is_special_weapon = 1 AND sergeants_equipments.sergeantid = 1", getSpecialEquipments(err, q_specials, sergeant));//REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION
    })
    // !!!! ADD A SPECIAL QUERY FOR SPECIAL EQUIPMENTS
}

function getMarineEquipments(err, q_weapons, spacemarine){
    if(err){
        next(err);
        return;
    }
    spacemarine.weapons=q_weapons;
}

function getSergeantEquipments(err, q_weapons, sergeant){
    if(err){
        next(err);
        return;
    }
    sergeant.weapons=q_weapons;
}

function getSpecialEquipments(){
	if(err){
        next(err);
        return;
    }
    sergeant.specialEquipments=q_specials;
}
module.exports = router;