var should = require('should');

describe('simplealarms', function ( ) {

  var simplealarms = require('../lib/plugins/simplealarms')();
  var delta = require('../lib/plugins/delta')();

  var env = require('../env')();
  var ctx = {};
  ctx.data = require('../lib/data')(env, ctx);
  ctx.notifications = require('../lib/notifications')(env, ctx);

  var now = Date.now();
  var before = now - (5 * 60 * 1000);


  it('Not trigger an alarm when in range', function (done) {
    ctx.notifications.initRequests();
    ctx.data.sgvs = [{x: now, y: 100}];

    var sbx = require('../lib/sandbox')().serverInit(env, ctx);
    simplealarms.checkNotifications(sbx);
    should.not.exist(ctx.notifications.findHighestAlarm());

    done();
  });

  it('should trigger a warning when above target', function (done) {
    ctx.notifications.initRequests();
    ctx.data.sgvs = [{x: before, y: 171}, {x: now, y: 181}];

    var sbx = require('../lib/sandbox')().serverInit(env, ctx);
    delta.setProperties(sbx);
    simplealarms.checkNotifications(sbx);
    var highest = ctx.notifications.findHighestAlarm();
    highest.level.should.equal(ctx.notifications.levels.WARN);
    highest.message.should.equal('BG Now: 181 +10 mg/dl');
    done();
  });

  it('should trigger a urgent alarm when really high', function (done) {
    ctx.notifications.initRequests();
    ctx.data.sgvs = [{x: now, y: 400}];

    var sbx = require('../lib/sandbox')().serverInit(env, ctx);
    simplealarms.checkNotifications(sbx);
    ctx.notifications.findHighestAlarm().level.should.equal(ctx.notifications.levels.URGENT);

    done();
  });

  it('should trigger a warning when below target', function (done) {
    ctx.notifications.initRequests();
    ctx.data.sgvs = [{x: now, y: 70}];

    var sbx = require('../lib/sandbox')().serverInit(env, ctx);
    simplealarms.checkNotifications(sbx);
    ctx.notifications.findHighestAlarm().level.should.equal(ctx.notifications.levels.WARN);

    done();
  });

  it('should trigger a urgent alarm when really low', function (done) {
    ctx.notifications.initRequests();
    ctx.data.sgvs = [{x: now, y: 40}];

    var sbx = require('../lib/sandbox')().serverInit(env, ctx);
    simplealarms.checkNotifications(sbx);
    ctx.notifications.findHighestAlarm().level.should.equal(ctx.notifications.levels.URGENT);

    done();
  });


});