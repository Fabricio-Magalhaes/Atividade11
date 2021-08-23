const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {validationResult, matchedData} = require('express-validator');
const State = require('../models/state');
const User = require('../models/user');

module.exports = {
    getStates: async(req, res) => {
        let states = await states.find();
        res.json({states});

    },
    info: async(req, res) => {
        let token = req.query.token;

        const user = await User.findOne({token});
        const state = await State.findById(user.state);

        res.json({
            name: user.name,
            email: user.email,
            state: state.name
        });
    },
    editAction: async(req, res)=>{
        const erros = validationResult(req);
        if(!erros.isEmpty()){
            res.json({
                error: erros.mapped()
            });
            return;
        }
        const data = matchedData(req);

        let updates = {};

        if(data.name){
            updates.name = data.name;
        }
        if(data.email){
            const emailCheck = await User.findOne({email: data.email});
            if(emailCheck){
                res.json({ error: 'Email ja existente'});
                return;
            }
            updates.email = data.email;
        }
        if(data.state){
            if(mongoose.Types.ObjectId.isValid(data.state)){
                const stateCheck = await State.findById(data.state);

                if(!stateCheck){
                    res.json({ error: 'Estado não exisite'});
                    return;
                }
                updates.state = data.state;
            }else{
                res.json({ error: 'Codigo do estado em formato invalido'});
                return;
            }
        }
        if(data.password){
            updates.passwordHash = await bcrypt.hash(data.password, 10);
        }
        await User.findOneAndUpdate({ token: data.token}, {$set: updates});

        res.json({});
    }
};