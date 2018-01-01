import test from 'ava';
import { FibonacciHeap } from '../';
import testHelper from '@tyriar/heap-tests/union-tests';

testHelper.run(test, FibonacciHeap);
