function setup(app){
    app.get('/api/info', function(req, res) {
        res.json(['polymer', 'taktik']);
    });
}

module.exports = setup;
