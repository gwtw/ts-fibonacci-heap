import test from 'ava';
import { FibonacciHeap } from '../';
import testHelper from '@tyriar/heap-tests/decrease-key-tests';

testHelper.run(test, FibonacciHeap);
