import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';

import applyEnhancers from './enhancer-applier.js';

suite('enhancers', () => {
  const results = any.simpleObject();

  test('that an enhancer that matches the project is executed', async () => {
    const lift = sinon.stub();
    const anotherLift = sinon.stub();
    const test = sinon.stub();
    const otherLift = sinon.spy();
    const liftNextSteps = any.listOf(any.simpleObject);
    const liftResults = {nextSteps: liftNextSteps};
    const anotherLiftResults = any.simpleObject();
    const options = any.simpleObject();
    test.withArgs(options).resolves(true);
    lift.withArgs({results, ...options}, {}).resolves(liftResults);
    anotherLift.withArgs({results: {...results, ...liftResults}, ...options}, {}).resolves(anotherLiftResults);

    const enhancerResults = await applyEnhancers({
      results,
      enhancers: {
        [any.word()]: {test, lift},
        [any.word()]: {test: () => Promise.resolve(false), lift: otherLift},
        [any.word()]: {test, lift: anotherLift}
      },
      options
    });

    assert.deepEqual(enhancerResults, {...results, ...liftResults, ...anotherLiftResults});
    assert.calledWith(lift, {results, ...options});
    assert.notCalled(otherLift);
  });

  test('that an enhancer without a `test` predicate does not result in an error', async () => {
    const lift = sinon.stub();
    const anotherLift = sinon.stub();
    const test = sinon.stub();
    const otherLift = sinon.spy();
    const liftNextSteps = any.listOf(any.simpleObject);
    const liftResults = {nextSteps: liftNextSteps};
    const anotherLiftResults = any.simpleObject();
    const options = any.simpleObject();
    test.withArgs(options).resolves(true);
    lift.withArgs({results, ...options}, {}).resolves(liftResults);
    anotherLift.withArgs({results: {...results, ...liftResults}, ...options}, {}).resolves(anotherLiftResults);

    const enhancerResults = await applyEnhancers({
      results,
      enhancers: {
        [any.word()]: {test, lift},
        [any.word()]: {lift: otherLift},
        [any.word()]: {test, lift: anotherLift}
      },
      options
    });

    assert.deepEqual(enhancerResults, {...results, ...liftResults, ...anotherLiftResults});
    assert.calledWith(lift, {results, ...options});
    assert.notCalled(otherLift);
  });

  test('that an enhancer without a `lift` function is skipped', async () => {
    const lift = sinon.stub();
    const anotherLift = sinon.stub();
    const test = sinon.stub();
    const otherLift = sinon.spy();
    const liftNextSteps = any.listOf(any.simpleObject);
    const liftResults = {nextSteps: liftNextSteps};
    const anotherLiftResults = any.simpleObject();
    const options = any.simpleObject();
    test.withArgs(options).resolves(true);
    lift.withArgs({results, ...options}, {}).resolves(liftResults);
    anotherLift.withArgs({results: {...results, ...liftResults}, ...options}, {}).resolves(anotherLiftResults);

    const enhancerResults = await applyEnhancers({
      results,
      enhancers: {
        [any.word()]: {test, lift},
        [any.word()]: {test},
        [any.word()]: {test, lift: anotherLift}
      },
      options
    });

    assert.deepEqual(enhancerResults, {...results, ...liftResults, ...anotherLiftResults});
    assert.calledWith(lift, {results, ...options});
    assert.notCalled(otherLift);
  });

  test('that dependencies are passed to enhancers when provided', async () => {
    const lift = sinon.stub();
    const anotherLift = sinon.stub();
    const test = sinon.stub();
    const otherLift = sinon.spy();
    const liftNextSteps = any.listOf(any.simpleObject);
    const liftResults = {nextSteps: liftNextSteps};
    const anotherLiftResults = any.simpleObject();
    const options = any.simpleObject();
    const dependencies = any.simpleObject();
    test.withArgs(options).resolves(true);
    lift.withArgs({results, ...options}, dependencies).resolves(liftResults);
    anotherLift
      .withArgs({results: {...results, ...liftResults}, ...options}, dependencies)
      .resolves(anotherLiftResults);

    const enhancerResults = await applyEnhancers({
      results,
      enhancers: {
        [any.word()]: {test, lift},
        [any.word()]: {test: () => Promise.resolve(false), lift: otherLift},
        [any.word()]: {test, lift: anotherLift}
      },
      options,
      dependencies
    });

    assert.deepEqual(enhancerResults, {...results, ...liftResults, ...anotherLiftResults});
    assert.calledWith(lift, {results, ...options});
    assert.notCalled(otherLift);
  });

  test('that an enhancer error rejects the enhancer application', async () => {
    const error = new Error('from test');

    try {
      await applyEnhancers({
        results,
        enhancers: {
          [any.word()]: {
            test: () => Promise.resolve(true),
            lift: () => Promise.reject(error)
          }
        }
      });

      throw new Error('applying enhancers should have thrown an error');
    } catch (e) {
      assert.equal(e, error);
    }
  });

  test('that no liftEnhancers are applied if none are provided', async () => {
    assert.deepEqual(await applyEnhancers({results}), results);
  });

  test('that empty results are applied when none are provided', async () => {
    assert.deepEqual(await applyEnhancers({}), {});
  });
});
