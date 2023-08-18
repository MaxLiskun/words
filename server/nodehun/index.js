const express = require('express');
const fs = require('fs')
const Nodehun = require('nodehun')


const affix = fs.readFileSync('../server/nodehun/dictionaries/uk/index.aff')
const dictionary = fs.readFileSync('../server/nodehun/dictionaries/uk/index.dic')

const nodehun = new Nodehun(affix, dictionary)
example()


async function example() {
	const suggestions = await nodehun.suggest('будино')
  console.log(suggestions)
}
