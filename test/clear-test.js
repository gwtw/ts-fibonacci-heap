import test from 'ava';
import { FibonacciHeap } from '../';
import testHelper from '@tyriar/heap-tests/clear-tests';

testHelper.run(test, FibonacciHeap);
