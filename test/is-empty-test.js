import test from 'ava';
import { FibonacciHeap } from '../';
import testHelper from '@tyriar/heap-tests/is-empty-tests';

testHelper.run(test, FibonacciHeap);
